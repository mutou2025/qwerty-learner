import SpeakingPanel from './components/SpeakingPanel'
import { useSpeakingReducer } from './store'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { DictChapterButton } from '@/pages/Typing/components/DictChapterButton'
import { useWordList } from '@/pages/Typing/hooks/useWordList'
import { randomConfigAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import IconKeyboard from '~icons/tabler/keyboard'
import IconMicrophone from '~icons/tabler/microphone'

export default function Speaking() {
  const [state, dispatch] = useSpeakingReducer()
  const { words, isLoading } = useWordList()
  const randomConfig = useAtomValue(randomConfigAtom)
  const [showIntro, setShowIntro] = useState(true)
  const [isStarted, setIsStarted] = useState(false)

  // 随机打乱单词（如果启用）
  const shuffledWords = useMemo(() => {
    if (!words) return []
    if (randomConfig.isOpen) {
      return [...words].sort(() => Math.random() - 0.5)
    }
    return words
  }, [words, randomConfig.isOpen])

  // 当前单词
  const currentWord = shuffledWords[state.wordIndex]

  // 检查是否练习完成
  const isFinished =
    state.wordIndex >= shuffledWords.length && shuffledWords.length > 0 && isStarted

  // 开始练习
  const handleStart = () => {
    setShowIntro(false)
    setIsStarted(true)
    dispatch({ type: 'RESET' })
  }

  // 重新开始
  const handleRestart = () => {
    dispatch({ type: 'RESET' })
    setShowIntro(true)
    setIsStarted(false)
  }

  return (
    <Layout>
      <Header>
        <DictChapterButton returnTo="/speaking" />
        <Link
          to="/"
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <IconKeyboard className="h-4 w-4" />
          打字模式
        </Link>
      </Header>

      <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-400 border-r-transparent"
              role="status"
            />
          </div>
        ) : showIntro ? (
          // 介绍页面
          <div className="flex max-w-lg flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <IconMicrophone className="h-10 w-10 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">口语跟读</h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              听发音跟读单词，锻炼英语口语发音。
              <br />
              系统会识别您的发音并给出匹配度评分。
            </p>
            <div className="w-full rounded-lg bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <p className="mb-2 font-medium">快捷键：</p>
              <ul className="space-y-1">
                <li>
                  <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">
                    空格
                  </kbd>{' '}
                  播放发音
                </li>
                <li>
                  <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">
                    回车
                  </kbd>{' '}
                  开始/停止录音
                </li>
                <li>
                  <kbd className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-600">
                    R
                  </kbd>{' '}
                  重试当前单词
                </li>
              </ul>
            </div>
            <div className="w-full rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              <p className="font-medium">注意：</p>
              <p>需要使用 Chrome、Edge 或 Safari 浏览器，并允许麦克风权限。</p>
            </div>
            <button
              onClick={handleStart}
              className="w-full rounded-lg bg-indigo-500 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
            >
              开始跟读
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              共 {shuffledWords.length} 个单词
            </p>
          </div>
        ) : isFinished ? (
          // 完成页面
          <div className="flex max-w-lg flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <IconMicrophone className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">练习完成！</h1>
            <div className="grid w-full grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {state.correctCount}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">正确</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {state.wrongCount}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">错误</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                正确率:{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {state.correctCount + state.wrongCount > 0
                    ? Math.round(
                        (state.correctCount / (state.correctCount + state.wrongCount)) * 100,
                      )
                    : 0}
                  %
                </span>
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="w-full rounded-lg bg-indigo-500 py-3 font-medium text-white transition-colors hover:bg-indigo-600"
            >
              再练一次
            </button>
            <Link to="/" className="text-sm text-gray-500 hover:text-indigo-500 dark:text-gray-400">
              返回打字练习
            </Link>
          </div>
        ) : currentWord ? (
          <SpeakingPanel word={currentWord} state={state} dispatch={dispatch} />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">暂无单词</div>
        )}
      </div>
    </Layout>
  )
}
