import Achievements from './components/Achievements'
import HeatmapCharts from './components/HeatmapCharts'
import KeyboardWithBarCharts from './components/KeyboardWithBarCharts'
import LineCharts from './components/LineCharts'
import TodayOverview from './components/TodayOverview'
import TopErrorWords from './components/TopErrorWords'
import VocabularyDistribution from './components/VocabularyDistribution'
import { useAchievementStats } from './hooks/useAchievementStats'
import { useTodayStats } from './hooks/useTodayStats'
import { useWordStats } from './hooks/useWordStats'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { isOpenDarkModeAtom } from '@/store'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import IconChartLine from '~icons/tabler/chart-line'

const Analysis = () => {
  const navigate = useNavigate()
  const [, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom)
  const achievementStats = useAchievementStats()
  const { todayWords, todayMinutes } = useTodayStats()

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old)
  }

  useHotkeys(
    'ctrl+d',
    () => {
      changeDarkModeState()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  const { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord } =
    useWordStats(dayjs().subtract(1, 'year').unix(), dayjs().unix())

  return (
    <Layout>
      <Header>
        <div className="flex items-center gap-2">
          <IconChartLine className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-800 dark:text-white">学习统计</span>
        </div>
      </Header>

      <div className="flex w-full flex-1 flex-col overflow-y-auto px-6 py-6">
        <ScrollArea.Root className="flex-1 overflow-y-auto">
          <ScrollArea.Viewport className="h-full w-auto pb-[10rem] [&>div]:!block">
            {/* 今日概览卡片 */}
            <TodayOverview
              stats={achievementStats}
              todayWords={todayWords}
              todayMinutes={todayMinutes}
            />

            {isEmpty ? (
              <div className="mx-4 grid h-60 place-content-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                <div className="text-center">
                  <p className="text-xl text-gray-400">暂无练习数据</p>
                  <p className="mt-2 text-sm text-gray-400">
                    完成一些练习后，这里会显示你的学习统计
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* 词汇掌握 + 易错词 两栏布局 */}
                <div className="mx-4 mb-6 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <VocabularyDistribution />
                  </div>
                  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <TopErrorWords />
                  </div>
                </div>

                {/* 热力图 */}
                <div className="mx-4 mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <HeatmapCharts title="过去一年练习次数热力图" data={exerciseRecord} />
                </div>
                <div className="mx-4 mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <HeatmapCharts title="过去一年练习词数热力图" data={wordRecord} />
                </div>

                {/* WPM 和正确率趋势 */}
                <div className="mx-4 mb-6 grid gap-6 lg:grid-cols-2">
                  <div className="h-72 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <LineCharts title="WPM 趋势图" name="WPM" data={wpmRecord} />
                  </div>
                  <div className="h-72 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <LineCharts
                      title="正确率趋势图"
                      name="正确率(%)"
                      data={accuracyRecord}
                      suffix="%"
                    />
                  </div>
                </div>

                {/* 按键错误分析 */}
                <div className="mx-4 mb-6 h-72 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <KeyboardWithBarCharts
                    title="按键错误次数排行"
                    name="错误次数"
                    data={wrongTimeRecord}
                  />
                </div>

                {/* 成就系统 */}
                <div className="mx-4 mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  <Achievements stats={achievementStats} />
                </div>
              </>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex touch-none select-none bg-transparent"
            orientation="vertical"
          />
        </ScrollArea.Root>
      </div>
    </Layout>
  )
}

export default Analysis
