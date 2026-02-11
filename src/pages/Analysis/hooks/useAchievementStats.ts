import type { UserStats } from '../components/Achievements'
import { db } from '@/utils/db'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export function useAchievementStats(): UserStats {
  const [stats, setStats] = useState<UserStats>({
    totalWords: 0,
    totalExercises: 0,
    totalDays: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalTime: 0,
    avgWpm: 0,
    avgAccuracy: 0,
    perfectSessions: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const records = await db.wordRecords.toArray()

        if (records.length === 0) {
          return
        }

        // 基础统计
        const totalExercises = records.length
        const uniqueWords = new Set(records.map((r) => r.word))
        const totalWords = uniqueWords.size

        // 按日期分组
        const dateMap = new Map<
          string,
          { words: number; time: number; wrongCount: number; totalChars: number }
        >()
        records.forEach((record) => {
          const date = dayjs(record.timeStamp * 1000).format('YYYY-MM-DD')
          const existing = dateMap.get(date) || { words: 0, time: 0, wrongCount: 0, totalChars: 0 }
          const time = record.timing.reduce((acc, curr) => acc + curr, 0)
          dateMap.set(date, {
            words: existing.words + 1,
            time: existing.time + time,
            wrongCount: existing.wrongCount + record.wrongCount,
            totalChars: existing.totalChars + record.word.length,
          })
        })

        const totalDays = dateMap.size

        // 计算连续天数
        const sortedDates = Array.from(dateMap.keys()).sort()
        let currentStreak = 0
        let maxStreak = 0
        let tempStreak = 1

        // 检查今天是否有记录
        const today = dayjs().format('YYYY-MM-DD')
        const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
        const hasToday = dateMap.has(today)
        const hasYesterday = dateMap.has(yesterday)

        // 计算最大连续天数
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = dayjs(sortedDates[i - 1])
          const currDate = dayjs(sortedDates[i])
          const diff = currDate.diff(prevDate, 'day')

          if (diff === 1) {
            tempStreak++
          } else {
            maxStreak = Math.max(maxStreak, tempStreak)
            tempStreak = 1
          }
        }
        maxStreak = Math.max(maxStreak, tempStreak)

        // 计算当前连续天数
        if (hasToday || hasYesterday) {
          const startDate = hasToday ? today : yesterday
          let checkDate = dayjs(startDate)
          currentStreak = 0

          while (dateMap.has(checkDate.format('YYYY-MM-DD'))) {
            currentStreak++
            checkDate = checkDate.subtract(1, 'day')
          }
        }

        // 计算总时间（分钟）
        let totalTimeMs = 0
        dateMap.forEach((data) => {
          totalTimeMs += data.time
        })
        const totalTime = Math.round(totalTimeMs / 1000 / 60)

        // 计算平均 WPM
        let totalWpm = 0
        let wpmCount = 0
        dateMap.forEach((data) => {
          if (data.time > 0) {
            const wpm = Math.round(data.words / (data.time / 1000 / 60))
            if (wpm > 0 && wpm < 200) {
              // 过滤异常值
              totalWpm += wpm
              wpmCount++
            }
          }
        })
        const avgWpm = wpmCount > 0 ? Math.round(totalWpm / wpmCount) : 0

        // 计算平均正确率
        let totalAccuracy = 0
        let accuracyCount = 0
        dateMap.forEach((data) => {
          if (data.totalChars > 0) {
            const accuracy = (data.totalChars / (data.totalChars + data.wrongCount)) * 100
            totalAccuracy += accuracy
            accuracyCount++
          }
        })
        const avgAccuracy = accuracyCount > 0 ? Math.round(totalAccuracy / accuracyCount) : 0

        // 计算完美练习次数（100% 正确率的章节）
        // 简化：统计当天错误为 0 的天数
        let perfectSessions = 0
        dateMap.forEach((data) => {
          if (data.wrongCount === 0 && data.words > 0) {
            perfectSessions++
          }
        })

        setStats({
          totalWords,
          totalExercises,
          totalDays,
          currentStreak,
          maxStreak,
          totalTime,
          avgWpm,
          avgAccuracy,
          perfectSessions,
        })
      } catch (error) {
        console.error('Failed to fetch achievement stats:', error)
      }
    }

    fetchStats()
  }, [])

  return stats
}
