/**
 * 今日学习统计 Hook
 */
import { db } from '@/utils/db'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

interface TodayStats {
  todayWords: number
  todayMinutes: number
  isLoading: boolean
}

export function useTodayStats(): TodayStats {
  const [stats, setStats] = useState<TodayStats>({
    todayWords: 0,
    todayMinutes: 0,
    isLoading: true,
  })

  useEffect(() => {
    const loadTodayStats = async () => {
      try {
        // 获取今天开始的时间戳
        const todayStart = dayjs().startOf('day').unix()
        const todayEnd = dayjs().endOf('day').unix()

        // 查询今天的练习记录
        const records = await db.wordRecords
          .where('timeStamp')
          .between(todayStart, todayEnd)
          .toArray()

        // 统计今日词数（去重）
        const uniqueWords = new Set(records.map((r) => r.word))
        const todayWords = uniqueWords.size

        // 统计今日时长（毫秒 -> 分钟）
        let totalTimeMs = 0
        records.forEach((record) => {
          totalTimeMs += record.timing.reduce((acc, curr) => acc + curr, 0)
        })
        const todayMinutes = Math.round(totalTimeMs / 1000 / 60)

        setStats({
          todayWords,
          todayMinutes,
          isLoading: false,
        })
      } catch (error) {
        console.error('Failed to load today stats:', error)
        setStats((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadTodayStats()
  }, [])

  return stats
}
