'use client'
import { Suspense, useEffect, useReducer, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { decodeHtml, buildOptions } from '@/lib/trivia'
import { accuracyColor } from '@/lib/stats'
import type { TriviaQuestion } from '@/types'

interface ProcessedQ {
  question: string
  category: string
  difficulty: string
  correct_answer: string
  options: string[]
}

interface AnswerRecord {
  question_text: string
  category: string
  difficulty: string
  correct_answer: string
  player_answer: string
  is_correct: boolean
  time_taken_ms: number
}

type State = {
  status: 'loading' | 'playing' | 'revealed' | 'finished' | 'submitting' | 'error'
  questions: ProcessedQ[]
  currentIndex: number
  answers: AnswerRecord[]
  selected: string | null
  timeLeft: number
  error: string | null
}

type Action =
  | { type: 'LOADED'; questions: ProcessedQ[] }
  | { type: 'SELECT'; answer: string; timeTaken: number }
  | { type: 'TICK' }
  | { type: 'TIMEOUT'; timeTaken: number }
  | { type: 'NEXT' }
  | { type: 'SUBMITTING' }
  | { type: 'ERROR'; msg: string }

const TIME_PER_Q = 25

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      return { ...state, status: 'playing', questions: action.questions, timeLeft: TIME_PER_Q }

    case 'TICK':
      if (state.status !== 'playing') return state
      if (state.timeLeft <= 1) return state
      return { ...state, timeLeft: state.timeLeft - 1 }

    case 'TIMEOUT': {
      const q = state.questions[state.currentIndex]
      const record: AnswerRecord = {
        question_text: q.question,
        category: q.category,
        difficulty: q.difficulty,
        correct_answer: q.correct_answer,
        player_answer: '',
        is_correct: false,
        time_taken_ms: action.timeTaken,
      }
      const answers = [...state.answers, record]
      const isLast = state.currentIndex >= state.questions.length - 1
      return { ...state, status: isLast ? 'finished' : 'revealed', selected: null, answers }
    }

    case 'SELECT': {
      if (state.status !== 'playing') return state
      const q = state.questions[state.currentIndex]
      const is_correct = action.answer === q.correct_answer
      const record: AnswerRecord = {
        question_text: q.question,
        category: q.category,
        difficulty: q.difficulty,
        correct_answer: q.correct_answer,
        player_answer: action.answer,
        is_correct,
        time_taken_ms: action.timeTaken,
      }
      return { ...state, status: 'revealed', selected: action.answer, answers: [...state.answers, record] }
    }

    case 'NEXT': {
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.questions.length) return { ...state, status: 'finished' }
      return { ...state, status: 'playing', currentIndex: nextIndex, selected: null, timeLeft: TIME_PER_Q }
    }

    case 'SUBMITTING':
      return { ...state, status: 'submitting' }

    case 'ERROR':
      return { ...state, status: 'error', error: action.msg }

    default:
      return state
  }
}

const init: State = {
  status: 'loading',
  questions: [],
  currentIndex: 0,
  answers: [],
  selected: null,
  timeLeft: TIME_PER_Q,
  error: null,
}

export default function QuizPlayPage() {
  return <Suspense fallback={<LoadingScreen />}><QuizPlay /></Suspense>
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl mb-4 animate-pulse">🎯</div><p className="text-gray-400">Loading…</p></div>
    </div>
  )
}

function QuizPlay() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, init)
  const questionStartRef = useRef<number>(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const amount = searchParams.get('amount') || '10'

  useEffect(() => {
    fetch(`/api/questions?amount=${amount}&category=${category}&difficulty=${difficulty}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { dispatch({ type: 'ERROR', msg: data.error }); return }
        const questions: ProcessedQ[] = data.questions.map((q: TriviaQuestion) => ({
          question: decodeHtml(q.question),
          category: decodeHtml(q.category),
          difficulty: q.difficulty,
          correct_answer: decodeHtml(q.correct_answer),
          options: buildOptions(q),
        }))
        dispatch({ type: 'LOADED', questions })
        questionStartRef.current = Date.now()
      })
      .catch(() => dispatch({ type: 'ERROR', msg: 'Failed to load questions. Please try again.' }))
  }, [amount, category, difficulty])

  // Countdown timer
  useEffect(() => {
    if (state.status !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state.status, state.currentIndex])

  // Auto-timeout when timeLeft hits 0
  useEffect(() => {
    if (state.status === 'playing' && state.timeLeft === 1) {
      const timeTaken = Date.now() - questionStartRef.current
      dispatch({ type: 'TIMEOUT', timeTaken })
    }
  }, [state.timeLeft, state.status])

  // Auto-advance after reveal
  useEffect(() => {
    if (state.status !== 'revealed') return
    const t = setTimeout(() => {
      dispatch({ type: 'NEXT' })
      questionStartRef.current = Date.now()
    }, 1800)
    return () => clearTimeout(t)
  }, [state.status, state.currentIndex])

  const handleAnswer = useCallback((option: string) => {
    if (state.status !== 'playing') return
    const timeTaken = Date.now() - questionStartRef.current
    dispatch({ type: 'SELECT', answer: option, timeTaken })
  }, [state.status])

  async function handleSubmit() {
    dispatch({ type: 'SUBMITTING' })
    const res = await fetch('/api/quiz/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: state.answers, category: category || null, difficulty: difficulty || null }),
    })
    if (res.ok) router.push('/dashboard')
    else dispatch({ type: 'ERROR', msg: 'Failed to save results.' })
  }

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🎯</div>
          <p className="text-gray-400">Loading questions…</p>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">😬</div>
          <p className="text-red-400 mb-6">{state.error}</p>
          <button onClick={() => router.push('/quiz')} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (state.status === 'finished' || state.status === 'submitting') {
    const correct = state.answers.filter(a => a.is_correct).length
    const total = state.answers.length
    const acc = Math.round((correct / total) * 100)

    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">
            {acc >= 80 ? '🏆' : acc >= 60 ? '👍' : acc >= 40 ? '💪' : '📚'}
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: accuracyColor(acc) }}>{acc}%</h1>
          <p className="text-gray-400 mb-8">{correct} of {total} correct</p>

          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 mb-8 text-left">
            {state.answers.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0">{a.is_correct ? '✅' : '❌'}</span>
                <div className="min-w-0">
                  <p className="text-sm text-white leading-snug">{a.question_text}</p>
                  {!a.is_correct && a.player_answer && (
                    <p className="text-xs text-red-400 mt-0.5">You: {a.player_answer}</p>
                  )}
                  {!a.is_correct && (
                    <p className="text-xs text-green-400 mt-0.5">Correct: {a.correct_answer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={state.status === 'submitting'}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors"
          >
            {state.status === 'submitting' ? 'Saving…' : 'Save results & view stats →'}
          </button>
        </div>
      </div>
    )
  }

  const q = state.questions[state.currentIndex]
  const progress = ((state.currentIndex) / state.questions.length) * 100
  const timerPct = (state.timeLeft / TIME_PER_Q) * 100

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="text-gray-400 text-sm">{state.currentIndex + 1} / {state.questions.length}</span>
        <span className="text-xs text-gray-500 truncate max-w-xs">{q.category}</span>
        <span className={`text-sm font-mono font-bold ${state.timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
          {state.timeLeft}s
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div className="h-1 bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Timer bar */}
      <div className="h-0.5 bg-gray-800">
        <div
          className={`h-0.5 transition-all duration-1000 ${state.timeLeft <= 5 ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${
                q.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                q.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-red-900/50 text-red-400'
              }`}>{q.difficulty}</span>
            </div>
            <p className="text-lg font-semibold text-white leading-snug">{q.question}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((option, i) => {
              const isRevealed = state.status === 'revealed'
              const isCorrect = option === q.correct_answer
              const isSelected = option === state.selected

              let cls = 'border border-gray-700 bg-gray-900 text-gray-300 hover:border-brand-500 hover:bg-brand-500/10'
              if (isRevealed) {
                if (isCorrect) cls = 'border-green-500 bg-green-500/20 text-green-300'
                else if (isSelected && !isCorrect) cls = 'border-red-500 bg-red-500/20 text-red-300'
                else cls = 'border-gray-800 bg-gray-900/50 text-gray-500'
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={isRevealed}
                  className={`${cls} rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default`}
                >
                  <span className="text-gray-500 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              )
            })}
          </div>

          {state.status === 'revealed' && state.selected === null && (
            <p className="text-center text-gray-500 text-sm mt-4">⏱ Time's up!</p>
          )}
        </div>
      </div>
    </div>
  )
}
