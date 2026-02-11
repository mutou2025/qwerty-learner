/**
 * 词汇掌握分布图组件
 */
import { useReviewCards } from '@/hooks/useReviewCards'
import IconCircleCheck from '~icons/tabler/circle-check'
import IconClock from '~icons/tabler/clock'
import IconProgress from '~icons/tabler/progress'

export default function VocabularyDistribution() {
  const { cards } = useReviewCards()

  // 计算掌握状态分布
  const mastered = cards.filter((c) => c.repetitions >= 3).length
  const learning = cards.filter((c) => c.repetitions > 0 && c.repetitions < 3).length
  const pending = cards.filter((c) => c.repetitions === 0).length
  const total = cards.length

  if (total === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-gray-400">
        <IconProgress className="mb-2 h-8 w-8" />
        <p>暂无复习记录</p>
        <p className="text-sm">前往「练习计划」添加单词</p>
      </div>
    )
  }

  const masteredPercent = Math.round((mastered / total) * 100)
  const learningPercent = Math.round((learning / total) * 100)
  const pendingPercent = 100 - masteredPercent - learningPercent

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-white">
        <IconProgress className="h-5 w-5 text-indigo-500" />
        词汇掌握分布
      </h3>

      {/* 进度条 */}
      <div className="mb-4 h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="flex h-full">
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${masteredPercent}%` }}
            title={`已掌握: ${masteredPercent}%`}
          />
          <div
            className="bg-yellow-500 transition-all"
            style={{ width: `${learningPercent}%` }}
            title={`学习中: ${learningPercent}%`}
          />
          <div
            className="bg-gray-400 transition-all"
            style={{ width: `${pendingPercent}%` }}
            title={`待复习: ${pendingPercent}%`}
          />
        </div>
      </div>

      {/* 图例 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
            <IconCircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{mastered}</p>
            <p className="text-xs text-gray-500">已掌握 {masteredPercent}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
            <IconProgress className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{learning}</p>
            <p className="text-xs text-gray-500">学习中 {learningPercent}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
            <IconClock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 dark:text-white">{pending}</p>
            <p className="text-xs text-gray-500">待复习 {pendingPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
