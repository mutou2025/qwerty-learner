import type { SpeakingAction, SpeakingState } from './type'
import { initialSpeakingState } from './type'
import { useImmerReducer } from 'use-immer'

function speakingReducer(draft: SpeakingState, action: SpeakingAction): void {
  switch (action.type) {
    case 'SET_STATUS':
      draft.status = action.payload
      break

    case 'SET_TRANSCRIPT':
      draft.transcript = action.payload.transcript
      draft.confidence = action.payload.confidence
      break

    case 'SET_SIMILARITY':
      draft.similarity = action.payload
      break

    case 'NEXT_WORD':
      draft.wordIndex += 1
      draft.status = 'idle'
      draft.transcript = ''
      draft.similarity = 0
      draft.confidence = 0
      break

    case 'REPLAY':
      draft.status = 'playing'
      draft.transcript = ''
      draft.similarity = 0
      draft.confidence = 0
      break

    case 'SUBMIT_RESULT':
      if (action.payload.isCorrect) {
        draft.correctCount += 1
      } else {
        draft.wrongCount += 1
      }
      draft.history.push({
        word: action.payload.word,
        transcript: draft.transcript,
        similarity: draft.similarity,
        isCorrect: action.payload.isCorrect,
        timestamp: Date.now(),
      })
      draft.status = 'result'
      break

    case 'SET_WORD_INDEX':
      draft.wordIndex = action.payload
      draft.status = 'idle'
      draft.transcript = ''
      draft.similarity = 0
      draft.confidence = 0
      break

    case 'RESET':
      Object.assign(draft, initialSpeakingState)
      break
  }
}

export function useSpeakingReducer() {
  return useImmerReducer(speakingReducer, initialSpeakingState)
}

export * from './type'
