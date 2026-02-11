import type { ReviewCard } from '@/lib/spaced-repetition/sm2'
import { useMemo } from 'react'

interface ReviewCalendarProps {
  cards: ReviewCard[]
  selectedDate?: string
  onDateClick?: (date: string) => void
}

export default function ReviewCalendar({ cards, selectedDate, onDateClick }: ReviewCalendarProps) {
  // 按日期统计卡片数量
  const cardCountByDate = useMemo(() => {
    const counts = new Map<string, number>()
    cards.forEach((card) => {
      const dateKey = new Date(card.nextReviewAt).toISOString().split('T')[0]
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1)
    })
    return counts
  }, [cards])

  // 生成日历数据
  const calendarData = useMemo(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()

    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // 获取第一天是星期几
    const startDayOfWeek = firstDay.getDay()

    // 生成日历格子
    const days: Array<{
      date: string
      day: number
      isCurrentMonth: boolean
      isToday: boolean
      count: number
    }> = []

    // 填充上月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const date = new Date(year, month - 1, day)
      const dateKey = date.toISOString().split('T')[0]
      days.push({
        date: dateKey,
        day,
        isCurrentMonth: false,
        isToday: false,
        count: cardCountByDate.get(dateKey) || 0,
      })
    }

    // 填充当月日期
    const todayStr = today.toISOString().split('T')[0]
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateKey = date.toISOString().split('T')[0]
      days.push({
        date: dateKey,
        day,
        isCurrentMonth: true,
        isToday: dateKey === todayStr,
        count: cardCountByDate.get(dateKey) || 0,
      })
    }

    // 填充下月的日期（补齐到 42 格，6 行）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      const dateKey = date.toISOString().split('T')[0]
      days.push({
        date: dateKey,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        count: cardCountByDate.get(dateKey) || 0,
      })
    }

    return {
      year,
      month,
      monthName: firstDay.toLocaleDateString('zh-CN', { month: 'long' }),
      days,
    }
  }, [cardCountByDate])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      {/* 月份标题 */}
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">
          {calendarData.year}年{calendarData.monthName}
        </h3>
      </div>

      {/* 星期标题 */}
      <div className="mb-2 grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day) => (
          <div key={day} className="py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map((dayData, index) => (
          <button
            key={index}
            onClick={() => onDateClick?.(dayData.date)}
            className={`relative flex h-10 items-center justify-center rounded-lg text-sm transition-colors ${
              dayData.isToday
                ? 'bg-indigo-500 font-bold text-white'
                : dayData.isCurrentMonth
                ? selectedDate === dayData.date
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            {dayData.day}
            {/* 复习数量指示器 */}
            {dayData.count > 0 && (
              <span
                className={`absolute bottom-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-medium ${
                  dayData.isToday ? 'bg-white text-indigo-500' : 'bg-indigo-500 text-white'
                }`}
              >
                {dayData.count > 99 ? '99+' : dayData.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
          <span>今天</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 text-[8px] text-white">
            N
          </span>
          <span>待复习数量</span>
        </div>
      </div>
    </div>
  )
}
