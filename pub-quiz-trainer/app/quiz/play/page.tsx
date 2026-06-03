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
  image?: string
  explanation?: string
}

interface AnswerRecord {
  question_text: string
  category: string
  difficulty: string
  correct_answer: string
  player_answer: string
  is_correct: boolean
  time_taken_ms: number
  explanation?: string
  image?: string
}

type State = {
  status: 'loading' | 'playing' | 'revealed' | 'finished' | 'submitting' | 'error'
  questions: ProcessedQ[]
  currentIndex: number
  answers: AnswerRecord[]
  selected: string | null
  error: string | null
}

type Action =
  | { type: 'LOADED'; questions: ProcessedQ[] }
  | { type: 'SELECT'; answer: string; timeTaken: number }
  | { type: 'NEXT' }
  | { type: 'SUBMITTING' }
  | { type: 'ERROR'; msg: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      return { ...state, status: 'playing', questions: action.questions }

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
        explanation: q.explanation,
        image: q.image,
      }
      return { ...state, status: 'revealed', selected: action.answer, answers: [...state.answers, record] }
    }

    case 'NEXT': {
      const nextIndex = state.currentIndex + 1
      if (nextIndex >= state.questions.length) return { ...state, status: 'finished' }
      return { ...state, status: 'playing', currentIndex: nextIndex, selected: null }
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

  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const amount = searchParams.get('amount') || '10'
  const quizType = searchParams.get('type') || 'multiple'

  useEffect(() => {
    const params = new URLSearchParams({ amount, type: quizType })
    if (category) params.set('category', category)
    if (difficulty) params.set('difficulty', difficulty)
    fetch(`/api/questions?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { dispatch({ type: 'ERROR', msg: data.error }); return }
        const questions: ProcessedQ[] = data.questions.map((q: TriviaQuestion & { explanation?: string }) => ({
          question: decodeHtml(q.question),
          category: decodeHtml(q.category),
          difficulty: q.difficulty,
          correct_answer: decodeHtml(q.correct_answer),
          options: buildOptions(q),
          image: q.image,
          explanation: q.explanation,
        }))
        dispatch({ type: 'LOADED', questions })
        questionStartRef.current = Date.now()
      })
      .catch(() => dispatch({ type: 'ERROR', msg: 'Failed to load questions. Please try again.' }))
  }, [amount, category, difficulty, quizType])

  const handleAnswer = useCallback((option: string) => {
    if (state.status !== 'playing') return
    const timeTaken = Date.now() - questionStartRef.current
    dispatch({ type: 'SELECT', answer: option, timeTaken })
  }, [state.status])

  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT' })
    questionStartRef.current = Date.now()
  }, [])

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
              <div key={i} className="px-4 py-4 flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-lg">{a.is_correct ? '✅' : '❌'}</span>
                <div className="min-w-0 flex-1">
                  {a.image && (
                    <div className="mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt="" className="h-16 w-auto rounded object-cover" />
                    </div>
                  )}
                  <p className="text-sm text-white leading-snug font-medium">{a.question_text}</p>
                  {!a.is_correct && a.player_answer && (
                    <p className="text-xs text-red-400 mt-1">Your answer: {a.player_answer}</p>
                  )}
                  {!a.is_correct && (
                    <p className="text-xs text-green-400 mt-0.5 font-semibold">✓ {a.correct_answer}</p>
                  )}
                  {a.explanation && (
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed border-l-2 border-gray-700 pl-2 italic">{a.explanation}</p>
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
  const isRevealed = state.status === 'revealed'
  const isLastQuestion = state.currentIndex + 1 >= state.questions.length

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <span className="text-gray-400 text-sm">{state.currentIndex + 1} / {state.questions.length}</span>
        <span className="text-xs text-gray-500 truncate max-w-xs">{q.category}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-800">
        <div className="h-1 bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
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
            {q.image && (
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={q.image}
                  alt="Quiz question"
                  className="h-48 w-auto rounded-lg border border-gray-700 object-contain shadow-lg"
                />
              </div>
            )}
            <p className="text-lg font-semibold text-white leading-snug">{q.question}</p>

            {isRevealed && q.explanation && (
              <div className="mt-4 p-3 bg-blue-950/40 border border-blue-800/50 rounded-lg">
                <p className="text-sm text-blue-200 leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((option, i) => {
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

          {isRevealed && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base"
              >
                {isLastQuestion ? 'See results →' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
