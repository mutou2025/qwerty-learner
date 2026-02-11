import { useMemo } from 'react'
import IconBook from '~icons/tabler/book'
import IconClock from '~icons/tabler/clock'
import IconCrown from '~icons/tabler/crown'
import IconDiamond from '~icons/tabler/diamond'
import IconFlame from '~icons/tabler/flame'
import IconMedal from '~icons/tabler/medal'
import IconRocket from '~icons/tabler/rocket'
import IconStar from '~icons/tabler/star'
import IconTarget from '~icons/tabler/target'
import IconTrophy from '~icons/tabler/trophy'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  condition: (stats: UserStats) => boolean
  progress?: (stats: UserStats) => { current: number; target: number }
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface UserStats {
  totalWords: number
  totalExercises: number
  totalDays: number
  currentStreak: number
  maxStreak: number
  totalTime: number // 分钟
  avgWpm: number
  avgAccuracy: number
  perfectSessions: number
}

// 成就定义
export const ACHIEVEMENTS: Achievement[] = [
  // 单词数量成就
  {
    id: 'words_100',
    name: '初学者',
    description: '累计练习 100 个单词',
    icon: <IconBook className="h-6 w-6" />,
    condition: (stats) => stats.totalWords >= 100,
    progress: (stats) => ({ current: Math.min(stats.totalWords, 100), target: 100 }),
    tier: 'bronze',
  },
  {
    id: 'words_500',
    name: '勤奋学习',
    description: '累计练习 500 个单词',
    icon: <IconBook className="h-6 w-6" />,
    condition: (stats) => stats.totalWords >= 500,
    progress: (stats) => ({ current: Math.min(stats.totalWords, 500), target: 500 }),
    tier: 'silver',
  },
  {
    id: 'words_2000',
    name: '词汇达人',
    description: '累计练习 2000 个单词',
    icon: <IconBook className="h-6 w-6" />,
    condition: (stats) => stats.totalWords >= 2000,
    progress: (stats) => ({ current: Math.min(stats.totalWords, 2000), target: 2000 }),
    tier: 'gold',
  },
  {
    id: 'words_10000',
    name: '词汇大师',
    description: '累计练习 10000 个单词',
    icon: <IconCrown className="h-6 w-6" />,
    condition: (stats) => stats.totalWords >= 10000,
    progress: (stats) => ({ current: Math.min(stats.totalWords, 10000), target: 10000 }),
    tier: 'platinum',
  },

  // 连续天数成就
  {
    id: 'streak_3',
    name: '坚持三天',
    description: '连续练习 3 天',
    icon: <IconFlame className="h-6 w-6" />,
    condition: (stats) => stats.maxStreak >= 3,
    progress: (stats) => ({ current: Math.min(stats.currentStreak, 3), target: 3 }),
    tier: 'bronze',
  },
  {
    id: 'streak_7',
    name: '一周坚持',
    description: '连续练习 7 天',
    icon: <IconFlame className="h-6 w-6" />,
    condition: (stats) => stats.maxStreak >= 7,
    progress: (stats) => ({ current: Math.min(stats.currentStreak, 7), target: 7 }),
    tier: 'silver',
  },
  {
    id: 'streak_30',
    name: '月度坚持',
    description: '连续练习 30 天',
    icon: <IconFlame className="h-6 w-6" />,
    condition: (stats) => stats.maxStreak >= 30,
    progress: (stats) => ({ current: Math.min(stats.currentStreak, 30), target: 30 }),
    tier: 'gold',
  },
  {
    id: 'streak_100',
    name: '百日冲刺',
    description: '连续练习 100 天',
    icon: <IconDiamond className="h-6 w-6" />,
    condition: (stats) => stats.maxStreak >= 100,
    progress: (stats) => ({ current: Math.min(stats.currentStreak, 100), target: 100 }),
    tier: 'platinum',
  },

  // 速度成就
  {
    id: 'wpm_30',
    name: '打字新手',
    description: '平均 WPM 达到 30',
    icon: <IconRocket className="h-6 w-6" />,
    condition: (stats) => stats.avgWpm >= 30,
    tier: 'bronze',
  },
  {
    id: 'wpm_60',
    name: '打字高手',
    description: '平均 WPM 达到 60',
    icon: <IconRocket className="h-6 w-6" />,
    condition: (stats) => stats.avgWpm >= 60,
    tier: 'silver',
  },
  {
    id: 'wpm_100',
    name: '闪电手指',
    description: '平均 WPM 达到 100',
    icon: <IconRocket className="h-6 w-6" />,
    condition: (stats) => stats.avgWpm >= 100,
    tier: 'gold',
  },

  // 准确率成就
  {
    id: 'accuracy_90',
    name: '精准射手',
    description: '平均正确率达到 90%',
    icon: <IconTarget className="h-6 w-6" />,
    condition: (stats) => stats.avgAccuracy >= 90,
    tier: 'silver',
  },
  {
    id: 'accuracy_98',
    name: '完美主义',
    description: '平均正确率达到 98%',
    icon: <IconTarget className="h-6 w-6" />,
    condition: (stats) => stats.avgAccuracy >= 98,
    tier: 'gold',
  },

  // 特殊成就
  {
    id: 'perfect_10',
    name: '十全十美',
    description: '完成 10 次 100% 正确率练习',
    icon: <IconStar className="h-6 w-6" />,
    condition: (stats) => stats.perfectSessions >= 10,
    progress: (stats) => ({ current: Math.min(stats.perfectSessions, 10), target: 10 }),
    tier: 'gold',
  },
  {
    id: 'time_60',
    name: '一小时挑战',
    description: '累计练习时间达到 60 分钟',
    icon: <IconClock className="h-6 w-6" />,
    condition: (stats) => stats.totalTime >= 60,
    tier: 'bronze',
  },
  {
    id: 'time_600',
    name: '十小时坚持',
    description: '累计练习时间达到 10 小时',
    icon: <IconClock className="h-6 w-6" />,
    condition: (stats) => stats.totalTime >= 600,
    tier: 'silver',
  },
]

// 等级颜色配置
const tierColors = {
  bronze: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-600 dark:text-amber-400',
    icon: 'text-amber-500',
  },
  silver: {
    bg: 'bg-gray-100 dark:bg-gray-700/50',
    border: 'border-gray-300 dark:border-gray-600',
    text: 'text-gray-600 dark:text-gray-300',
    icon: 'text-gray-400',
  },
  gold: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: 'text-yellow-500',
  },
  platinum: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    border: 'border-indigo-300 dark:border-indigo-700',
    text: 'text-indigo-600 dark:text-indigo-400',
    icon: 'text-indigo-500',
  },
}

interface AchievementsProps {
  stats: UserStats
}

export default function Achievements({ stats }: AchievementsProps) {
  // 计算成就状态
  const achievementStatus = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: achievement.condition(stats),
      progress: achievement.progress?.(stats),
    }))
  }, [stats])

  // 分组：已解锁和未解锁
  const unlockedAchievements = achievementStatus.filter((a) => a.unlocked)
  const lockedAchievements = achievementStatus.filter((a) => !a.unlocked)

  return (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-medium text-gray-800 dark:text-white">
          <IconTrophy className="h-5 w-5 text-yellow-500" />
          成就系统
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          已解锁 {unlockedAchievements.length} / {ACHIEVEMENTS.length}
        </span>
      </div>

      {/* 已解锁成就 */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">已解锁</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => {
              const colors = tierColors[achievement.tier]
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-3 rounded-xl border p-4 ${colors.bg} ${colors.border}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 ${colors.icon}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${colors.text}`}>{achievement.name}</span>
                      <IconMedal className={`h-4 w-4 ${colors.icon}`} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 未解锁成就 */}
      {lockedAchievements.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">待解锁</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-400 dark:bg-gray-700">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-600 dark:text-gray-400">
                    {achievement.name}
                  </span>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {achievement.description}
                  </p>
                  {/* 进度条 */}
                  {achievement.progress && (
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                        <div
                          className="h-full bg-indigo-400 transition-all"
                          style={{
                            width: `${
                              (achievement.progress.current / achievement.progress.target) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">
                        {achievement.progress.current} / {achievement.progress.target}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
