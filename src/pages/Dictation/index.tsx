import ResultScreen from './components/ResultScreen'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { DictChapterButton } from '@/pages/Typing/components/DictChapterButton'
import Speed from '@/pages/Typing/components/Speed'
import WordPanel from '@/pages/Typing/components/WordPanel'
import { useConfetti } from '@/pages/Typing/hooks/useConfetti'
import { useWordList } from '@/pages/Typing/hooks/useWordList'
import {
  TypingContext,
  TypingStateActionType,
  initialState,
  typingReducer,
} from '@/pages/Typing/store'
import { idDictionaryMap } from '@/resources/dictionary'
import {
  currentChapterAtom,
  currentDictIdAtom,
  pronunciationConfigAtom,
  randomConfigAtom,
  wordDictationConfigAtom,
} from '@/store'
import { isLegal } from '@/utils'
import { useSaveChapterRecord } from '@/utils/db'
import { useMixPanelChapterLogUploader } from '@/utils/mixpanel'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useImmerReducer } from 'use-immer'
import IconKeyboard from '~icons/tabler/keyboard'

export default function Dictation() {
  const [state, dispatch] = useImmerReducer(typingReducer, structuredClone(initialState))
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { words } = useWordList()

  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  const setCurrentChapter = useSetAtom(currentChapterAtom)
  const randomConfig = useAtomValue(randomConfigAtom)
  const chapterLogUploader = useMixPanelChapterLogUploader(state)
  const saveChapterRecord = useSaveChapterRecord()

  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom)
  const setPronunciationConfig = useSetAtom(pronunciationConfigAtom)
  const savedConfigRef = useRef<{ isOpen: boolean; type: string; openBy: string } | null>(null)

  // On mount: force hideAll mode and enable pronunciation
  // On unmount: restore previous config
  useEffect(() => {
    setWordDictationConfig((old) => {
      savedConfigRef.current = { ...old }
      return { ...old, isOpen: true, type: 'hideAll' as const, openBy: 'auto' as const }
    })
    setPronunciationConfig((old) => ({ ...old, isOpen: true }))

    return () => {
      if (savedConfigRef.current) {
        const saved = savedConfigRef.current
        setWordDictationConfig(() => saved as typeof saved & { type: 'hideAll'; openBy: 'auto' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Validate dictionary exists
  useEffect(() => {
    if (!(currentDictId in idDictionaryMap)) {
      setCurrentDictId('cet4')
      setCurrentChapter(0)
    }
  }, [currentDictId, setCurrentChapter, setCurrentDictId])

  const skipWord = useCallback(() => {
    dispatch({ type: TypingStateActionType.SKIP_WORD })
  }, [dispatch])

  // Handle window blur
  useEffect(() => {
    const onBlur = () => {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [dispatch])

  // Track loading state
  useEffect(() => {
    state.chapterData.words?.length > 0 ? setIsLoading(false) : setIsLoading(true)
  }, [state.chapterData.words])

  // Start typing on keypress
  useEffect(() => {
    if (!state.isTyping) {
      const onKeyDown = (e: KeyboardEvent) => {
        if (
          !isLoading &&
          e.key !== 'Enter' &&
          (isLegal(e.key) || e.key === ' ') &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault()
          dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: true })
        }
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
    }
  }, [state.isTyping, isLoading, dispatch])

  // Setup chapter when words load
  useEffect(() => {
    if (words !== undefined) {
      dispatch({
        type: TypingStateActionType.SETUP_CHAPTER,
        payload: { words, shouldShuffle: randomConfig.isOpen },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words])

  // Save chapter record on finish
  useEffect(() => {
    if (state.isFinished && !state.isSavingRecord) {
      chapterLogUploader()
      saveChapterRecord(state)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isFinished, state.isSavingRecord])

  // Timer
  useEffect(() => {
    let intervalId: number
    if (state.isTyping) {
      intervalId = window.setInterval(() => {
        dispatch({ type: TypingStateActionType.TICK_TIMER })
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [state.isTyping, dispatch])

  useConfetti(state.isFinished)

  return (
    <TypingContext.Provider value={{ state, dispatch }}>
      {state.isFinished && <ResultScreen />}
      <Layout>
        <Header>
          <DictChapterButton returnTo="/dictation" />
          <Link
            to="/"
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <IconKeyboard className="h-4 w-4" />
            打字模式
          </Link>
        </Header>
        <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center pb-5">
          <div className="container relative mx-auto flex h-full flex-col items-center">
            <div className="container flex flex-grow items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></div>
                </div>
              ) : (
                !state.isFinished && <WordPanel />
              )}
            </div>
            <Speed />
          </div>
        </div>
      </Layout>
    </TypingContext.Provider>
  )
}
