import FlashCard from './components/FlashCard'
import ReviewCalendar from './components/ReviewCalendar'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { useReviewCards } from '@/hooks/useReviewCards'
import { SimpleQuality, createReviewCard } from '@/lib/spaced-repetition/sm2'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IconCalendar from '~icons/tabler/calendar'
import IconCheck from '~icons/tabler/check'
import IconCloud from '~icons/tabler/cloud'
import IconCloudOff from '~icons/tabler/cloud-off'
import IconLoader from '~icons/tabler/loader-2'
import IconPlayerPlay from '~icons/tabler/player-play'
import IconPlus from '~icons/tabler/plus'
import IconRefresh from '~icons/tabler/refresh'

export default function Review() {
  const {
    cards,
    dueCards,
    isLoading,
    isSyncing,
    isLoggedIn,
    addCards,
    reviewCard,
    clearAllCards,
    syncNow,
  } = useReviewCards()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)

  // 当前卡片
  const currentCard = dueCards[currentIndex]

  // 开始复习
  const handleStartReview = useCallback(() => {
    setIsReviewing(true)
    setCurrentIndex(0)
    setReviewedCount(0)
  }, [])

  // 复习评分
  const handleReview = useCallback(
    async (quality: SimpleQuality) => {
      if (!currentCard) return

      await reviewCard(currentCard, quality)
      setReviewedCount((prev) => prev + 1)

      // 移动到下一张
      if (currentIndex < dueCards.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else {
        // 复习完成
        setIsReviewing(false)
      }
    },
    [currentCard, currentIndex, dueCards.length, reviewCard],
  )

  // 从错题本添加卡片（示例功能）
  const handleAddFromErrorBook = useCallback(() => {
    const sampleCards = [
      createReviewCard('abandon', ['v. 放弃；抛弃'], 'əˈbændən'),
      createReviewCard('ability', ['n. 能力；才能'], 'əˈbɪləti'),
      createReviewCard('abroad', ['adv. 在国外；到国外'], 'əˈbrɔːd'),
    ]
    addCards(sampleCards)
  }, [addCards])

  // 清空所有卡片
  const handleClearAll = useCallback(async () => {
    if (window.confirm('确定要清空所有复习卡片吗？')) {
      await clearAllCards()
    }
  }, [clearAllCards])

  // 键盘快捷键
  useEffect(() => {
    if (!isReviewing) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case '1':
          handleReview(SimpleQuality.Again)
          break
        case '2':
          handleReview(SimpleQuality.Hard)
          break
        case '3':
          handleReview(SimpleQuality.Good)
          break
        case '4':
          handleReview(SimpleQuality.Easy)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isReviewing, handleReview])

  return (
    <Layout>
      <Header>
        <div className="flex items-center gap-2">
          <IconCalendar className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-800 dark:text-white">练习计划</span>
        </div>
        {/* 云端同步状态 */}
        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={syncNow}
              disabled={isSyncing}
              className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-sm text-green-600 transition-colors hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            >
              {isSyncing ? (
                <IconLoader className="h-4 w-4 animate-spin" />
              ) : (
                <IconCloud className="h-4 w-4" />
              )}
              <span>{isSyncing ? '同步中...' : '已同步云端'}</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              <IconCloudOff className="h-4 w-4" />
              <span>登录同步数据</span>
            </Link>
          )}
        </div>
      </Header>

      <div className="container mx-auto flex-1 px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <IconLoader className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : isReviewing && currentCard ? (
          // 复习模式
          <div className="flex flex-col items-center">
            {/* 进度 */}
            <div className="mb-6 flex w-full max-w-md items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                进度: {currentIndex + 1} / {dueCards.length}
              </span>
              <span>已复习: {reviewedCount}</span>
            </div>

            {/* 进度条 */}
            <div className="mb-8 h-2 w-full max-w-md overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
              />
            </div>

            {/* 卡片 */}
            <FlashCard card={currentCard} onReview={handleReview} />

            {/* 退出按钮 */}
            <button
              onClick={() => setIsReviewing(false)}
              className="mt-8 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              退出复习
            </button>
          </div>
        ) : (
          // 概览模式
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 左侧：统计和操作 */}
            <div className="space-y-6 lg:col-span-2">
              {/* 今日复习 */}
              <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">今日复习</h2>

                {dueCards.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {dueCards.length}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">个单词待复习</p>
                    </div>
                    <button
                      onClick={handleStartReview}
                      className="flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
                    >
                      <IconPlayerPlay className="h-5 w-5" />
                      开始复习
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <IconCheck className="mb-4 h-16 w-16 text-green-500" />
                    <p className="text-lg font-medium text-gray-800 dark:text-white">
                      今日复习已完成！
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {cards.length > 0 ? '明天再来继续学习吧' : '添加一些单词开始学习'}
                    </p>
                  </div>
                )}
              </div>

              {/* 统计信息 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{cards.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">总卡片数</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {cards.filter((c) => c.repetitions >= 3).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">已掌握</p>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {cards.filter((c) => c.repetitions < 3 && c.repetitions > 0).length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">学习中</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/error-book"
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <IconPlus className="h-4 w-4" />
                  从错题本添加
                </Link>
                <button
                  onClick={handleAddFromErrorBook}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <IconPlus className="h-4 w-4" />
                  添加示例卡片
                </button>
                {cards.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <IconRefresh className="h-4 w-4" />
                    清空卡片
                  </button>
                )}
              </div>
            </div>

            {/* 右侧：日历 */}
            <div>
              <ReviewCalendar cards={cards} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
