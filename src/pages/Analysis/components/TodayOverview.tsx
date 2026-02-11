/**
 * 今日学习概览卡片
 */
import type { UserStats } from './Achievements'
import IconBook from '~icons/tabler/book-2'
import IconClock from '~icons/tabler/clock'
import IconFlame from '~icons/tabler/flame'
import IconTarget from '~icons/tabler/target'

interface TodayOverviewProps {
  stats: UserStats
  todayWords: number
  todayMinutes: number
}

export default function TodayOverview({ stats, todayWords, todayMinutes }: TodayOverviewProps) {
  return (
    <div className="mx-4 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* 连续打卡 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-400 to-red-500 p-5 text-white shadow-lg">
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <IconFlame className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">连续打卡</span>
          </div>
          <p className="text-3xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs opacity-75">天 / 最长 {stats.maxStreak} 天</p>
        </div>
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
      </div>

      {/* 今日词数 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 p-5 text-white shadow-lg">
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <IconBook className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">今日练习</span>
          </div>
          <p className="text-3xl font-bold">{todayWords}</p>
          <p className="text-xs opacity-75">词</p>
        </div>
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
      </div>

      {/* 今日时长 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-5 text-white shadow-lg">
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <IconClock className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">今日时长</span>
          </div>
          <p className="text-3xl font-bold">{todayMinutes}</p>
          <p className="text-xs opacity-75">分钟</p>
        </div>
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
      </div>

      {/* 累计词汇 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 p-5 text-white shadow-lg">
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <IconTarget className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">累计词汇</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalWords}</p>
          <p className="text-xs opacity-75">词</p>
        </div>
        <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
      </div>
    </div>
  )
}
