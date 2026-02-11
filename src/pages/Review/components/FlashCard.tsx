import usePronunciation from '@/hooks/usePronunciation'
import type { ReviewCard } from '@/lib/spaced-repetition/sm2'
import { SimpleQuality } from '@/lib/spaced-repetition/sm2'
import { useCallback, useState } from 'react'
import IconVolume from '~icons/tabler/volume'

interface FlashCardProps {
  card: ReviewCard
  onReview: (quality: SimpleQuality) => void
  showAnswer?: boolean
}

export default function FlashCard({
  card,
  onReview,
  showAnswer: initialShowAnswer = false,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(initialShowAnswer)
  const { play } = usePronunciation(card.word)

  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped)
  }, [isFlipped])

  const handlePlaySound = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      play()
    },
    [play],
  )

  const handleReview = useCallback(
    (quality: SimpleQuality) => {
      onReview(quality)
      setIsFlipped(false)
    },
    [onReview],
  )

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 卡片 */}
      <div
        onClick={handleFlip}
        className="perspective-1000 group relative h-64 w-full max-w-md cursor-pointer"
      >
        <div
          className={`transform-style-preserve-3d relative h-full w-full transition-transform duration-500 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* 正面 - 单词 */}
          <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">{card.word}</h2>
            {card.usphone && (
              <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">[{card.usphone}]</p>
            )}
            <button
              onClick={handlePlaySound}
              className="rounded-full bg-indigo-100 p-3 text-indigo-600 transition-colors hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            >
              <IconVolume className="h-6 w-6" />
            </button>
            <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">点击卡片查看答案</p>
          </div>

          {/* 背面 - 释义 */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-indigo-50 p-6 shadow-lg dark:bg-indigo-900/20">
            <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">{card.word}</h2>
            <div className="mb-4 text-center">
              {card.trans.map((t, i) => (
                <p key={i} className="text-lg text-gray-600 dark:text-gray-300">
                  {t}
                </p>
              ))}
            </div>
            <button
              onClick={handlePlaySound}
              className="rounded-full bg-white p-2 text-indigo-600 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600"
            >
              <IconVolume className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 评分按钮 */}
      {isFlipped && (
        <div className="flex w-full max-w-md flex-col gap-3">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">你记住了吗？</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleReview(SimpleQuality.Again)}
              className="flex flex-col items-center rounded-xl bg-red-100 py-3 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <span className="text-sm font-medium">忘记了</span>
              <span className="text-xs opacity-70">1分钟</span>
            </button>
            <button
              onClick={() => handleReview(SimpleQuality.Hard)}
              className="flex flex-col items-center rounded-xl bg-orange-100 py-3 text-orange-600 transition-colors hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
            >
              <span className="text-sm font-medium">困难</span>
              <span className="text-xs opacity-70">1天</span>
            </button>
            <button
              onClick={() => handleReview(SimpleQuality.Good)}
              className="flex flex-col items-center rounded-xl bg-green-100 py-3 text-green-600 transition-colors hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
            >
              <span className="text-sm font-medium">良好</span>
              <span className="text-xs opacity-70">
                {card.repetitions === 0
                  ? '1天'
                  : card.repetitions === 1
                  ? '6天'
                  : `${Math.round(card.interval * card.easeFactor)}天`}
              </span>
            </button>
            <button
              onClick={() => handleReview(SimpleQuality.Easy)}
              className="flex flex-col items-center rounded-xl bg-blue-100 py-3 text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <span className="text-sm font-medium">简单</span>
              <span className="text-xs opacity-70">
                {card.repetitions === 0
                  ? '4天'
                  : `${Math.round(card.interval * card.easeFactor * 1.3)}天`}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 快捷键提示 */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        <span className="mr-3">空格: 翻转卡片</span>
        <span className="mr-3">1-4: 评分</span>
        <span>P: 播放发音</span>
      </div>
    </div>
  )
}
