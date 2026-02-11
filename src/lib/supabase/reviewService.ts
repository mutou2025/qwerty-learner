/**
 * 复习记录云端同步服务
 * 会员登录后自动同步复习记录到 Supabase
 */
import { supabase } from './client'
import type { ReviewRecord } from './types'
import type { ReviewCard } from '@/lib/spaced-repetition/sm2'

// 本地存储 key
const LOCAL_STORAGE_KEY = 'reviewCards'

/**
 * 从云端加载复习记录
 */
export async function loadReviewRecordsFromCloud(): Promise<ReviewCard[]> {
  if (!supabase) {
    console.warn('Supabase not configured, using local storage only')
    return loadFromLocalStorage()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return loadFromLocalStorage()
  }

  const { data, error } = await supabase.from('review_records').select('*').eq('user_id', user.id)

  if (error) {
    console.error('Failed to load review records from cloud:', error)
    return loadFromLocalStorage()
  }

  // 转换为前端 ReviewCard 格式
  return (data || []).map(dbRecordToCard)
}

/**
 * 保存复习记录到云端
 */
export async function saveReviewRecordToCloud(card: ReviewCard): Promise<boolean> {
  if (!supabase) {
    saveToLocalStorage(card)
    return false
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    saveToLocalStorage(card)
    return false
  }

  const { error } = await supabase.from('review_records').upsert(
    {
      user_id: user.id,
      word: card.word,
      ease_factor: card.easeFactor,
      interval: card.interval,
      repetitions: card.repetitions,
      next_review_at: new Date(card.nextReviewAt).toISOString(),
    },
    {
      onConflict: 'user_id,word',
    },
  )

  if (error) {
    console.error('Failed to save review record to cloud:', error)
    saveToLocalStorage(card)
    return false
  }

  return true
}

/**
 * 批量保存复习记录到云端
 */
export async function saveAllReviewRecordsToCloud(cards: ReviewCard[]): Promise<boolean> {
  if (!supabase || cards.length === 0) {
    return false
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const records = cards.map((card) => ({
    user_id: user.id,
    word: card.word,
    ease_factor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    next_review_at: new Date(card.nextReviewAt).toISOString(),
  }))

  const { error } = await supabase.from('review_records').upsert(records, {
    onConflict: 'user_id,word',
  })

  if (error) {
    console.error('Failed to batch save review records:', error)
    return false
  }

  return true
}

/**
 * 删除云端复习记录
 */
export async function deleteReviewRecordFromCloud(word: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { error } = await supabase
    .from('review_records')
    .delete()
    .eq('user_id', user.id)
    .eq('word', word)

  if (error) {
    console.error('Failed to delete review record:', error)
    return false
  }

  return true
}

/**
 * 清空用户所有云端复习记录
 */
export async function clearAllReviewRecordsFromCloud(): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { error } = await supabase.from('review_records').delete().eq('user_id', user.id)

  if (error) {
    console.error('Failed to clear review records:', error)
    return false
  }

  return true
}

/**
 * 同步本地数据到云端（登录时调用）
 * 合并策略：以最新的更新时间为准
 */
export async function syncLocalToCloud(): Promise<ReviewCard[]> {
  if (!supabase) {
    return loadFromLocalStorage()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return loadFromLocalStorage()
  }

  // 1. 加载本地数据
  const localCards = loadFromLocalStorage()

  // 2. 加载云端数据
  const cloudCards = await loadReviewRecordsFromCloud()

  // 3. 合并数据（以最新的为准）
  const mergedMap = new Map<string, ReviewCard>()

  // 先添加云端数据
  cloudCards.forEach((card) => {
    mergedMap.set(card.word, card)
  })

  // 再用本地数据更新（如果本地更新时间更晚）
  localCards.forEach((localCard) => {
    const cloudCard = mergedMap.get(localCard.word)
    if (
      !cloudCard ||
      (localCard.lastReviewAt &&
        (!cloudCard.lastReviewAt || localCard.lastReviewAt > cloudCard.lastReviewAt))
    ) {
      mergedMap.set(localCard.word, localCard)
    }
  })

  const mergedCards = Array.from(mergedMap.values())

  // 4. 将合并后的数据同步到云端
  await saveAllReviewRecordsToCloud(mergedCards)

  // 5. 清空本地存储（已经同步到云端）
  localStorage.removeItem(LOCAL_STORAGE_KEY)

  return mergedCards
}

/**
 * 检查用户是否已登录
 */
export async function isUserLoggedIn(): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return !!user
}

// ============ 内部辅助函数 ============

function loadFromLocalStorage(): ReviewCard[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToLocalStorage(card: ReviewCard): void {
  const cards = loadFromLocalStorage()
  const index = cards.findIndex((c) => c.word === card.word)
  if (index >= 0) {
    cards[index] = card
  } else {
    cards.push(card)
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards))
}

function dbRecordToCard(record: ReviewRecord): ReviewCard {
  return {
    id: record.id,
    word: record.word,
    trans: [], // 翻译需要从词库获取
    easeFactor: record.ease_factor,
    interval: record.interval,
    repetitions: record.repetitions,
    nextReviewAt: record.next_review_at ? new Date(record.next_review_at).getTime() : Date.now(),
    createdAt: new Date(record.created_at).getTime(),
  }
}
