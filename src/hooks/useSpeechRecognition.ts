import { useCallback, useEffect, useRef, useState } from 'react'

interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  confidence: number
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

// 扩展 Window 接口以支持 Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: {
    isFinal: boolean
    [index: number]: {
      transcript: string
      confidence: number
    }
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // 检查浏览器是否支持 Web Speech API
  const isSupported =
    typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''
      let maxConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptText = result[0].transcript
        const resultConfidence = result[0].confidence

        if (result.isFinal) {
          finalTranscript += transcriptText
          if (resultConfidence > maxConfidence) {
            maxConfidence = resultConfidence
          }
        } else {
          interimTranscript += transcriptText
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript)
        setConfidence(maxConfidence)
      } else if (interimTranscript) {
        setTranscript(interimTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [isSupported])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return

    setTranscript('')
    setConfidence(0)
    setError(null)

    try {
      recognitionRef.current.start()
    } catch (err) {
      // 忽略已经在监听的错误
      console.warn('Speech recognition already started')
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    try {
      recognitionRef.current.stop()
    } catch (err) {
      console.warn('Speech recognition already stopped')
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(0)
    setError(null)
  }, [])

  return {
    isListening,
    transcript,
    confidence,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}

// 计算两个字符串的相似度 (用于评估发音准确性)
export function calculateSimilarity(expected: string, actual: string): number {
  const expectedLower = expected.toLowerCase().trim()
  const actualLower = actual.toLowerCase().trim()

  if (expectedLower === actualLower) return 1

  // Levenshtein 距离算法
  const matrix: number[][] = []

  for (let i = 0; i <= expectedLower.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= actualLower.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= expectedLower.length; i++) {
    for (let j = 1; j <= actualLower.length; j++) {
      if (expectedLower[i - 1] === actualLower[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 替换
          matrix[i][j - 1] + 1, // 插入
          matrix[i - 1][j] + 1, // 删除
        )
      }
    }
  }

  const distance = matrix[expectedLower.length][actualLower.length]
  const maxLength = Math.max(expectedLower.length, actualLower.length)

  return maxLength === 0 ? 1 : 1 - distance / maxLength
}
