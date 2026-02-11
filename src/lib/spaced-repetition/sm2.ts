/**
 * SM-2 间隔重复算法实现
 * 基于 SuperMemo 2 算法，用于计算最优复习间隔
 */

export interface ReviewCard {
  id: string
  word: string
  trans: string[]
  usphone?: string
  // SM-2 参数
  easeFactor: number // 难度因子 (初始 2.5)
  interval: number // 间隔天数
  repetitions: number // 连续正确次数
  nextReviewAt: number // 下次复习时间戳
  lastReviewAt?: number // 上次复习时间
  createdAt: number
}

export interface ReviewResult {
  interval: number
  repetitions: number
  easeFactor: number
  nextReviewAt: number
}

// 评分等级 (0-5)
export enum Quality {
  CompleteBlackout = 0, // 完全忘记
  IncorrectButRemembered = 1, // 错误但看到答案后记起
  IncorrectEasyRecall = 2, // 错误但容易回忆
  CorrectWithDifficulty = 3, // 正确但费力
  CorrectWithHesitation = 4, // 正确但有犹豫
  Perfect = 5, // 完美回忆
}

// 简化的评分选项（用于 UI）
export enum SimpleQuality {
  Again = 0, // 再来一次 (对应 0-2)
  Hard = 3, // 困难 (对应 3)
  Good = 4, // 良好 (对应 4)
  Easy = 5, // 简单 (对应 5)
}

/**
 * 计算下次复习时间
 * @param quality 评分 (0-5)
 * @param repetitions 当前连续正确次数
 * @param easeFactor 当前难度因子
 * @param interval 当前间隔天数
 * @returns 新的复习参数
 */
export function calculateNextReview(
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number,
): ReviewResult {
  // 确保 quality 在 0-5 范围内
  quality = Math.max(0, Math.min(5, quality))

  // 计算新的难度因子
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  // 难度因子最小为 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor)

  let newInterval: number
  let newRepetitions: number

  if (quality < 3) {
    // 回答错误，重置
    newRepetitions = 0
    newInterval = 1
  } else {
    // 回答正确
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      newInterval = 1 // 第一次正确：1天后
    } else if (newRepetitions === 2) {
      newInterval = 6 // 第二次正确：6天后
    } else {
      // 之后按难度因子计算
      newInterval = Math.round(interval * newEaseFactor)
    }
  }

  // 计算下次复习时间
  const now = new Date()
  const nextReviewAt = new Date(now)
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval)
  nextReviewAt.setHours(0, 0, 0, 0)

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    nextReviewAt: nextReviewAt.getTime(),
  }
}

/**
 * 创建新的复习卡片
 */
export function createReviewCard(word: string, trans: string[], usphone?: string): ReviewCard {
  const now = Date.now()
  return {
    id: `review_${now}_${Math.random().toString(36).substring(2, 9)}`,
    word,
    trans,
    usphone,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: now, // 立即可复习
    createdAt: now,
  }
}

/**
 * 更新卡片复习状态
 */
export function updateCardAfterReview(card: ReviewCard, quality: SimpleQuality): ReviewCard {
  const result = calculateNextReview(quality, card.repetitions, card.easeFactor, card.interval)

  return {
    ...card,
    easeFactor: result.easeFactor,
    interval: result.interval,
    repetitions: result.repetitions,
    nextReviewAt: result.nextReviewAt,
    lastReviewAt: Date.now(),
  }
}

/**
 * 获取今天需要复习��卡片
 */
export function getDueCards(cards: ReviewCard[]): ReviewCard[] {
  const now = Date.now()
  return cards
    .filter((card) => card.nextReviewAt <= now)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
}

/**
 * 获取即将到期的卡片（未来 N 天）
 */
export function getUpcomingCards(cards: ReviewCard[], days = 7): ReviewCard[] {
  const now = Date.now()
  const futureDate = now + days * 24 * 60 * 60 * 1000

  return cards
    .filter((card) => card.nextReviewAt > now && card.nextReviewAt <= futureDate)
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
}

/**
 * 按日期分组卡片
 */
export function groupCardsByDate(cards: ReviewCard[]): Map<string, ReviewCard[]> {
  const groups = new Map<string, ReviewCard[]>()

  cards.forEach((card) => {
    const dateKey = new Date(card.nextReviewAt).toISOString().split('T')[0]
    const existing = groups.get(dateKey) || []
    groups.set(dateKey, [...existing, card])
  })

  return groups
}

/**
 * 格式化间隔显示
 */
export function formatInterval(days: number): string {
  if (days === 0) return '今天'
  if (days === 1) return '明天'
  if (days < 7) return `${days}天后`
  if (days < 30) return `${Math.round(days / 7)}周后`
  if (days < 365) return `${Math.round(days / 30)}个月后`
  return `${Math.round(days / 365)}年后`
}
