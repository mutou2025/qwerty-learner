import type { SpeakingAction, SpeakingState } from '../store'
import usePronunciation from '@/hooks/usePronunciation'
import { calculateSimilarity, useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import type { Word } from '@/typings'
import { useCallback, useEffect } from 'react'
import IconArrowRight from '~icons/tabler/arrow-right'
import IconCheck from '~icons/tabler/check'
import IconMicrophone from '~icons/tabler/microphone'
import IconMicrophoneOff from '~icons/tabler/microphone-off'
import IconPlayerPlay from '~icons/tabler/player-play'
import IconRefresh from '~icons/tabler/refresh'
import IconX from '~icons/tabler/x'

interface SpeakingPanelProps {
  word: Word
  state: SpeakingState
  dispatch: React.Dispatch<SpeakingAction>
}

// 相似度阈值，高于此值视为正确
const SIMILARITY_THRESHOLD = 0.7

export default function SpeakingPanel({ word, state, dispatch }: SpeakingPanelProps) {
  const {
    isListening,
    transcript,
    confidence,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  const { play } = usePronunciation(word.name)

  // 播放单词发音
  const handlePlayWord = useCallback(() => {
    dispatch({ type: 'SET_STATUS', payload: 'playing' })
    play()
    // 播放完成后恢复 idle 状态
    setTimeout(() => {
      if (state.status === 'playing') {
        dispatch({ type: 'SET_STATUS', payload: 'idle' })
      }
    }, 1500)
  }, [dispatch, play, state.status])

  // 开始录音
  const handleStartListening = useCallback(() => {
    resetTranscript()
    dispatch({ type: 'SET_STATUS', payload: 'listening' })
    startListening()
  }, [dispatch, startListening, resetTranscript])

  // 停止录音并计算结果
  const handleStopListening = useCallback(() => {
    stopListening()
  }, [stopListening])

  // 监听语音识别结果
  useEffect(() => {
    if (transcript) {
      dispatch({ type: 'SET_TRANSCRIPT', payload: { transcript, confidence } })
    }
  }, [transcript, confidence, dispatch])

  // 监听录音结束
  useEffect(() => {
    if (!isListening && state.status === 'listening' && transcript) {
      // 计算相似度
      const similarity = calculateSimilarity(word.name, transcript)
      dispatch({ type: 'SET_SIMILARITY', payload: similarity })

      // 判断是否正确
      const isCorrect = similarity >= SIMILARITY_THRESHOLD
      dispatch({ type: 'SUBMIT_RESULT', payload: { word, isCorrect } })
    }
  }, [isListening, state.status, transcript, word, dispatch])

  // 下一个单词
  const handleNextWord = useCallback(() => {
    resetTranscript()
    dispatch({ type: 'NEXT_WORD' })
  }, [dispatch, resetTranscript])

  // 重试当前单词
  const handleRetry = useCallback(() => {
    resetTranscript()
    dispatch({ type: 'REPLAY' })
    handlePlayWord()
  }, [dispatch, resetTranscript, handlePlayWord])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (state.status === 'idle' || state.status === 'playing') {
            handlePlayWord()
          } else if (state.status === 'result') {
            handleNextWord()
          }
          break
        case 'Enter':
          e.preventDefault()
          if (state.status === 'idle') {
            handleStartListening()
          } else if (state.status === 'listening') {
            handleStopListening()
          } else if (state.status === 'result') {
            handleNextWord()
          }
          break
        case 'r':
        case 'R':
          if (state.status === 'result') {
            e.preventDefault()
            handleRetry()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    state.status,
    handlePlayWord,
    handleStartListening,
    handleStopListening,
    handleNextWord,
    handleRetry,
  ])

  // 浏览器不支持提示
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-yellow-50 p-8 dark:bg-yellow-900/20">
        <IconMicrophoneOff className="mb-4 h-12 w-12 text-yellow-500" />
        <p className="text-center text-yellow-700 dark:text-yellow-400">
          您的浏览器不支持语音识别功能。
          <br />
          请使用 Chrome、Edge 或 Safari 浏览器。
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 单词卡片 */}
      <div className="flex min-h-[200px] w-full max-w-lg flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
        {/* 单词 */}
        <h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">{word.name}</h2>

        {/* 音标 */}
        {word.usphone && (
          <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">[{word.usphone}]</p>
        )}

        {/* 释义 */}
        <p className="text-center text-gray-600 dark:text-gray-300">{word.trans.join('；')}</p>
      </div>

      {/* 操作区域 */}
      <div className="flex flex-col items-center gap-4">
        {/* 状态提示 */}
        {state.status === 'idle' && (
          <p className="text-gray-500 dark:text-gray-400">按空格键播放发音，按回车开始跟读</p>
        )}

        {state.status === 'playing' && <p className="text-indigo-500">正在播放发音...</p>}

        {state.status === 'listening' && (
          <div className="flex items-center gap-2 text-red-500">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>
            正在录音...
          </div>
        )}

        {state.status === 'result' && (
          <div className="flex flex-col items-center gap-2">
            {/* 识别结果 */}
            <div className="flex items-center gap-2">
              {state.similarity >= SIMILARITY_THRESHOLD ? (
                <IconCheck className="h-6 w-6 text-green-500" />
              ) : (
                <IconX className="h-6 w-6 text-red-500" />
              )}
              <span
                className={`text-lg font-medium ${
                  state.similarity >= SIMILARITY_THRESHOLD
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {state.transcript || '未识别到语音'}
              </span>
            </div>

            {/* 相似度 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>匹配度: {Math.round(state.similarity * 100)}%</span>
              {state.confidence > 0 && <span>置信度: {Math.round(state.confidence * 100)}%</span>}
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && <p className="text-red-500">错误: {error}</p>}

        {/* 操作按钮 */}
        <div className="flex items-center gap-4">
          {/* 播放发音按钮 */}
          <button
            onClick={handlePlayWord}
            disabled={state.status === 'listening'}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-colors hover:bg-indigo-200 disabled:opacity-50 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            title="播放发音 (空格)"
          >
            <IconPlayerPlay className="h-6 w-6" />
          </button>

          {/* 录音按钮 */}
          {state.status !== 'result' ? (
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
              title={isListening ? '停止录音 (回车)' : '开始跟读 (回车)'}
            >
              {isListening ? (
                <IconMicrophoneOff className="h-8 w-8" />
              ) : (
                <IconMicrophone className="h-8 w-8" />
              )}
            </button>
          ) : (
            <>
              {/* 重试按钮 */}
              <button
                onClick={handleRetry}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                title="重试 (R)"
              >
                <IconRefresh className="h-6 w-6" />
              </button>

              {/* 下一个按钮 */}
              <button
                onClick={handleNextWord}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600"
                title="下一个 (回车)"
              >
                <IconArrowRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <IconCheck className="h-4 w-4 text-green-500" />
          正确: {state.correctCount}
        </span>
        <span className="flex items-center gap-1">
          <IconX className="h-4 w-4 text-red-500" />
          错误: {state.wrongCount}
        </span>
      </div>

      {/* 快捷键提示 */}
      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        <span className="mr-4">空格: 播放发音</span>
        <span className="mr-4">回车: 开始/停止录音</span>
        <span>R: 重试</span>
      </div>
    </div>
  )
}
