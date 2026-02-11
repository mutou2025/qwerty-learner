/**
 * 易错词排行榜组件
 */
import { db } from '@/utils/db'
import { useEffect, useState } from 'react'
import IconAlertTriangle from '~icons/tabler/alert-triangle'

interface ErrorWord {
  word: string
  count: number
  trans?: string[]
}

export default function TopErrorWords() {
  const [errorWords, setErrorWords] = useState<ErrorWord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadErrorWords = async () => {
      try {
        // 获取所有错误记录
        const records = await db.wordRecords.where('wrongCount').above(0).toArray()

        // 按单词分组并统计错误次数
        const wordMap = new Map<string, number>()
        records.forEach((record) => {
          const current = wordMap.get(record.word) || 0
          wordMap.set(record.word, current + record.wrongCount)
        })

        // 排序并取 Top 10
        const sorted = Array.from(wordMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([word, count]) => ({ word, count }))

        setErrorWords(sorted)
      } catch (error) {
        console.error('Failed to load error words:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadErrorWords()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (errorWords.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-gray-400">
        <IconAlertTriangle className="mb-2 h-8 w-8" />
        <p>暂无错误记录，继续保持！</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-white">
        <IconAlertTriangle className="h-5 w-5 text-orange-500" />
        易错词 Top 10
      </h3>
      <div className="space-y-2">
        {errorWords.map((item, index) => (
          <div
            key={item.word}
            className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2.5 dark:bg-gray-700/50"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                index < 3
                  ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
              }`}
            >
              {index + 1}
            </span>
            <span className="flex-1 font-medium text-gray-800 dark:text-white">{item.word}</span>
            <span className="rounded bg-red-100 px-2 py-0.5 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {item.count} 次
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
