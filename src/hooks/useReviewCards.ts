/**
 * useReviewCards Hook
 * 管理复习卡片状态，自动处理云端同步
 */
import type { ReviewCard, SimpleQuality } from '@/lib/spaced-repetition/sm2'
import { createReviewCard, getDueCards, updateCardAfterReview } from '@/lib/spaced-repetition/sm2'
import {
  clearAllReviewRecordsFromCloud,
  loadReviewRecordsFromCloud,
  saveAllReviewRecordsToCloud,
  saveReviewRecordToCloud,
  syncLocalToCloud,
} from '@/lib/supabase/reviewService'
import { currentUserAtom } from '@/store/authAtom'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'reviewCards'

interface UseReviewCardsResult {
  cards: ReviewCard[]
  dueCards: ReviewCard[]
  isLoading: boolean
  isSyncing: boolean
  isLoggedIn: boolean
  addCard: (word: string, trans: string[], usphone?: string) => Promise<void>
  addCards: (newCards: ReviewCard[]) => Promise<void>
  reviewCard: (card: ReviewCard, quality: SimpleQuality) => Promise<void>
  clearAllCards: () => Promise<void>
  syncNow: () => Promise<void>
}

export function useReviewCards(): UseReviewCardsResult {
  const user = useAtomValue(currentUserAtom)
  const isLoggedIn = !!user

  const [cards, setCards] = useState<ReviewCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  // 初始加载
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true)
      try {
        if (isLoggedIn) {
          // 登录用户：先同步本地数据，然后从云端加载
          const syncedCards = await syncLocalToCloud()
          setCards(syncedCards)
        } else {
          // 未登录：从本地存储加载
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
          setCards(stored ? JSON.parse(stored) : [])
        }
      } catch (error) {
        console.error('Failed to load review cards:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCards()
  }, [isLoggedIn])

  // 添加单个卡片
  const addCard = useCallback(
    async (word: string, trans: string[], usphone?: string) => {
      const newCard = createReviewCard(word, trans, usphone)

      setCards((prev) => {
        // 检查是否已存在
        if (prev.some((c) => c.word === word)) {
          return prev
        }
        return [...prev, newCard]
      })

      if (isLoggedIn) {
        await saveReviewRecordToCloud(newCard)
      } else {
        // 保存到本地
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        const existing = stored ? JSON.parse(stored) : []
        if (!existing.some((c: ReviewCard) => c.word === word)) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...existing, newCard]))
        }
      }
    },
    [isLoggedIn],
  )

  // 批量添加卡片
  const addCards = useCallback(
    async (newCards: ReviewCard[]) => {
      setCards((prev) => {
        const existingWords = new Set(prev.map((c) => c.word))
        const uniqueNewCards = newCards.filter((c) => !existingWords.has(c.word))
        return [...prev, ...uniqueNewCards]
      })

      if (isLoggedIn) {
        await saveAllReviewRecordsToCloud(newCards)
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        const existing: ReviewCard[] = stored ? JSON.parse(stored) : []
        const existingWords = new Set(existing.map((c) => c.word))
        const uniqueNewCards = newCards.filter((c) => !existingWords.has(c.word))
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...existing, ...uniqueNewCards]))
      }
    },
    [isLoggedIn],
  )

  // 复习卡片
  const reviewCard = useCallback(
    async (card: ReviewCard, quality: SimpleQuality) => {
      const updatedCard = updateCardAfterReview(card, quality)

      setCards((prev) => prev.map((c) => (c.word === card.word ? updatedCard : c)))

      if (isLoggedIn) {
        await saveReviewRecordToCloud(updatedCard)
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
        const existing: ReviewCard[] = stored ? JSON.parse(stored) : []
        const updated = existing.map((c) => (c.word === card.word ? updatedCard : c))
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      }
    },
    [isLoggedIn],
  )

  // 清空所有卡片
  const clearAllCards = useCallback(async () => {
    setCards([])

    if (isLoggedIn) {
      await clearAllReviewRecordsFromCloud()
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }, [isLoggedIn])

  // 手动同步
  const syncNow = useCallback(async () => {
    if (!isLoggedIn) return

    setIsSyncing(true)
    try {
      const syncedCards = await syncLocalToCloud()
      setCards(syncedCards)
    } finally {
      setIsSyncing(false)
    }
  }, [isLoggedIn])

  // 计算待复习卡片
  const dueCards = getDueCards(cards)

  return {
    cards,
    dueCards,
    isLoading,
    isSyncing,
    isLoggedIn,
    addCard,
    addCards,
    reviewCard,
    clearAllCards,
    syncNow,
  }
}
