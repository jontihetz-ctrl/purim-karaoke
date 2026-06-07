'use client'
import { Suspense, useEffect, useReducer, useRef, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { decodeHtml, buildOptions } from '@/lib/trivia'
import { accuracyColor } from '@/lib/stats'
import type { TriviaQuestion } from '@/types'

const PREFETCH_AT = 5
const MINI_BATCH = 5

// Equal weight across all image types — one of each per pick
const IMAGE_TYPES = ['flags', 'places', 'faces', 'artworks']
const KNOWLEDGE_TYPES = ['multiple']
// One entry per category — every question has an explicit category in stats
const CATEGORY_POOL = [
  '9',   // General Knowledge
  '10',  // Books
  '11',  // Film
  '12',  // Music
  '14',  // Television
  '15',  // Video Games
  '17',  // Science & Nature
  '18',  // Computers
  '20',  // Mythology
  '21',  // Sports
  '22',  // Geography
  '23',  // History
  '24',  // Politics
  '25',  // Art
  '26',  // Celebrities
  '27',  // Animals
  '28',  // Vehicles
]
const DIFFICULTY_POOL = ['easy', 'medium', 'hard', '']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function miniBatchUrl(type: string, category?: string): string {
  const p = new URLSearchParams({ amount: String(MINI_BATCH), type })
  const cat = category ?? pick(CATEGORY_POOL)
  const diff = pick(DIFFICULTY_POOL)
  if (cat) p.set('category', cat)
  if (diff) p.set('difficulty', diff)
  return `/api/questions?${p}`
}

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

type Status = 'loading' | 'playing' | 'revealed' | 'waiting_more' | 'finished' | 'error'

type State = {
  status: Status
  questions: ProcessedQ[]
  currentIndex: number
  answers: AnswerRecord[]
  selected: string | null
  error: string | null
  fetchingMore: boolean
}

type Action =
  | { type: 'LOADED'; questions: ProcessedQ[] }
  | { type: 'SELECT'; answer: string; timeTaken: number }
  | { type: 'NEXT' }
  | { type: 'SKIP' }
  | { type: 'MORE_LOADING' }
  | { type: 'MORE_LOADED'; questions: ProcessedQ[] }
  | { type: 'FINISH' }
  | { type: 'ERROR'; msg: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      return { ...state, status: 'playing', questions: action.questions }

    case 'SELECT': {
      if (state.status !== 'playing') return state
      const q = state.questions[state.currentIndex]
      const is_correct = action.answer === q.correct_answer
      return {
        ...state,
        status: 'revealed',
        selected: action.answer,
        answers: [...state.answers, {
          question_text: q.question, category: q.category, difficulty: q.difficulty,
          correct_answer: q.correct_answer, player_answer: action.answer, is_correct,
          time_taken_ms: action.timeTaken, explanation: q.explanation, image: q.image,
        }],
      }
    }

    case 'NEXT': {
      const next = state.currentIndex + 1
      if (next >= state.questions.length) return { ...state, status: 'waiting_more', currentIndex: next, selected: null }
      return { ...state, status: 'playing', currentIndex: next, selected: null }
    }

    case 'SKIP': {
      if (state.status !== 'playing') return state
      const qs = state.questions.filter((_, i) => i !== state.currentIndex)
      if (state.currentIndex >= qs.length) return { ...state, questions: qs, status: 'waiting_more' }
      return { ...state, questions: qs }
    }

    case 'MORE_LOADING':
      return { ...state, fetchingMore: true }

    case 'MORE_LOADED': {
      const merged = [...state.questions, ...action.questions]
      return state.status === 'waiting_more'
        ? { ...state, fetchingMore: false, questions: merged, status: 'playing' }
        : { ...state, fetchingMore: false, questions: merged }
    }

    case 'FINISH':
      return state.answers.length === 0 ? state : { ...state, status: 'finished' }

    case 'ERROR':
      return { ...state, status: 'error', error: action.msg }

    default:
      return state
  }
}

const init: State = {
  status: 'loading', questions: [], currentIndex: 0,
  answers: [], selected: null, error: null, fetchingMore: false,
}

function processQ(q: TriviaQuestion & { explanation?: string }): ProcessedQ {
  return {
    question: decodeHtml(q.question), category: decodeHtml(q.category),
    difficulty: q.difficulty, correct_answer: decodeHtml(q.correct_answer),
    options: buildOptions(q), image: q.image, explanation: q.explanation,
  }
}

function wikiUrl(t: string) { return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}` }

// Extract a searchable noun phrase from a question when the answer itself is
// too generic (a number, year, or very short word) to look up on Wikipedia.
function questionToSearchTerm(question: string): string {
  // Strip leading "In what year", "How many", "What number", etc.
  const cleaned = question
    .replace(/^(in what year|how many|what number|which number|how old|in which year)[^a-z]*/i, '')
    .replace(/\?$/, '')
    .trim()
  // Take the first meaningful chunk (up to 5 words) as the search term
  const words = cleaned.split(/\s+/).slice(0, 6).join(' ')
  return words || question.slice(0, 60)
}

function truncate(text: string, n = 2) {
  const s = text.match(/[^.!?]+[.!?]+(\s|$)/g) || []
  return s.length ? s.slice(0, n).join('').trim() : text.slice(0, 280)
}

// ── Voice helpers ────────────────────────────────────────────────────────────
function matchLetter(heard: string): number {
  const t = heard.trim().toLowerCase()
  if (/^(a|ay|eh|alpha)$/.test(t) || t.startsWith('a ')) return 0
  if (/^(b|be|bee|bravo)$/.test(t) || t.startsWith('b ')) return 1
  if (/^(c|see|sea|si|charlie)$/.test(t) || t.startsWith('c ') || t.startsWith('see ')) return 2
  if (/^(d|dee|de|delta)$/.test(t) || t.startsWith('d ')) return 3
  return -1
}

function matchAnswerText(heard: string, options: string[]): number {
  const h = heard.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '')
  // True/False shorthand
  if (/^(true|yes|correct|right|yeah)$/.test(h)) {
    const ti = options.findIndex(o => o.toLowerCase() === 'true')
    if (ti >= 0) return ti
  }
  if (/^(false|no|wrong|nope|incorrect)$/.test(h)) {
    const fi = options.findIndex(o => o.toLowerCase() === 'false')
    if (fi >= 0) return fi
  }
  for (let i = 0; i < options.length; i++) {
    const opt = options[i].toLowerCase().replace(/[^a-z0-9\s]/g, '')
    if (h === opt) return i
    // Heard text contains or is contained by option (min 4 chars to avoid false matches)
    if (opt.length >= 4 && h.includes(opt.slice(0, Math.min(opt.length, 7)))) return i
    if (h.length >= 4 && opt.includes(h.slice(0, Math.min(h.length, 7)))) return i
  }
  return -1
}

export default function QuizPlayPage() {
  return <Suspense fallback={<Spinner />}><QuizPlay /></Suspense>
}

function QuizImage({ src, className, onSkip }: { src: string; className?: string; onSkip?: () => void }) {
  const [errored, setErrored] = useState(false)
  if (errored) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Quiz question"
      className={className}
      onError={() => { setErrored(true); onSkip?.() }}
      loading="eager"
    />
  )
}

function Spinner({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl mb-4 animate-pulse">🎯</div><p className="text-gray-400">{text}</p></div>
    </div>
  )
}

function QuizPlay() {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, init)
  const questionStartRef = useRef<number>(Date.now())
  const [wikiSummary, setWikiSummary] = useState<'idle' | 'loading' | string>('idle')
  const wikiAbortRef = useRef<AbortController | null>(null)

  // Auto-save refs
  const sessionIdRef = useRef<string | null>(null)
  const savingRef = useRef(false)
  const savedCountRef = useRef(0)   // how many answers already persisted
  const answersRef = useRef(state.answers)
  answersRef.current = state.answers

  // IP-based country for localised questions
  const countryRef = useRef<string>('')
  useEffect(() => {
    fetch('/api/local-questions?detect=1')
      .then(r => r.json())
      .then(d => { countryRef.current = d.country || '' })
      .catch(() => {})
  }, []) // eslint-disable-line

  // Voice mode
  const [voiceMode, setVoiceMode] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'speaking' | 'listening'>('idle')
  const voiceModeRef = useRef(false)
  voiceModeRef.current = voiceMode
  const stateRef = useRef(state)
  stateRef.current = state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function stopAllVoice() {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    recognitionRef.current?.abort()
    recognitionRef.current = null
    if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
    setVoiceStatus('idle')
  }

  function speakText(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) { onEnd?.(); return }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 1.05
    utt.onend = () => { setVoiceStatus('idle'); onEnd?.() }
    utt.onerror = () => { setVoiceStatus('idle'); onEnd?.() }
    setVoiceStatus('speaking')
    window.speechSynthesis.speak(utt)
  }

  function listenForAnswer(options: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec || !voiceModeRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new SpeechRec() as any
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    recognitionRef.current = rec
    setVoiceStatus('listening')

    rec.onresult = (e: any) => {
      recognitionRef.current = null
      const heard = e.results[0][0].transcript
      let idx = matchLetter(heard)
      if (idx < 0) idx = matchAnswerText(heard, options)
      if (idx >= 0 && idx < options.length && stateRef.current.status === 'playing') {
        dispatch({ type: 'SELECT', answer: options[idx], timeTaken: Date.now() - questionStartRef.current })
        setVoiceStatus('idle')
      } else {
        // Didn't match, listen again
        setTimeout(() => { if (voiceModeRef.current) listenForAnswer(options) }, 300)
      }
    }

    rec.onerror = () => {
      recognitionRef.current = null
      setVoiceStatus('idle')
      setTimeout(() => {
        if (voiceModeRef.current && stateRef.current.status === 'playing') listenForAnswer(options)
      }, 800)
    }

    rec.onend = () => {
      if (recognitionRef.current !== rec) return
      recognitionRef.current = null
      if (!voiceModeRef.current || stateRef.current.status !== 'playing') return
      setTimeout(() => listenForAnswer(options), 300)
    }

    try { rec.start() } catch {}
  }

  // Voice: speak question when new question appears
  useEffect(() => {
    if (!voiceMode || state.status !== 'playing') return
    const q = state.questions[state.currentIndex]
    if (!q) return

    stopAllVoice()
    const labels = ['A', 'B', 'C', 'D']
    const optText = q.options.map((o, i) => `${labels[i]}. ${o}`).join('. ')
    speakText(`${q.question}. ${optText}`, () => {
      if (voiceModeRef.current) listenForAnswer(q.options)
    })
    return () => { window.speechSynthesis?.cancel() }
  }, [voiceMode, state.status === 'playing' ? state.currentIndex : -1]) // eslint-disable-line

  // Voice: speak result and auto-advance after reveal
  useEffect(() => {
    if (!voiceMode || state.status !== 'revealed') return
    const q = state.questions[state.currentIndex]
    const last = state.answers[state.answers.length - 1]
    if (!q || !last) return

    recognitionRef.current?.abort()
    recognitionRef.current = null

    const resultText = last.is_correct
      ? `Correct! ${q.correct_answer}.`
      : `Wrong. The answer was ${q.correct_answer}.`

    speakText(resultText, () => {
      voiceTimerRef.current = setTimeout(() => {
        if (voiceModeRef.current) {
          dispatch({ type: 'NEXT' })
          questionStartRef.current = Date.now()
        }
      }, 1000)
    })
    return () => {
      window.speechSynthesis?.cancel()
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current)
    }
  }, [voiceMode, state.status === 'revealed' ? state.currentIndex : -1]) // eslint-disable-line

  // Clean up voice when toggled off or unmounted
  useEffect(() => { if (!voiceMode) stopAllVoice() }, [voiceMode])
  useEffect(() => () => stopAllVoice(), []) // eslint-disable-line

  // Batch loading — 4 knowledge + 1 image + local questions, shuffled
  async function loadBatch(onLoad: (qs: ProcessedQ[]) => void) {
    try {
      const safe = (p: Promise<Response>) => p.then(r => r.json()).catch(() => ({ questions: [] }))
      // Shuffle the category pool and take 4 distinct categories so each batch
      // covers different ground rather than independently picking at random.
      const shuffledCats = [...CATEGORY_POOL].sort(() => Math.random() - 0.5)
      const fetches = [
        safe(fetch(miniBatchUrl('multiple', shuffledCats[0]))),
        safe(fetch(miniBatchUrl('multiple', shuffledCats[1]))),
        safe(fetch(miniBatchUrl('multiple', shuffledCats[2]))),
        safe(fetch(miniBatchUrl('multiple', shuffledCats[3]))),
        safe(fetch(miniBatchUrl(pick(IMAGE_TYPES)))),
        countryRef.current
          ? safe(fetch(`/api/local-questions?country=${encodeURIComponent(countryRef.current)}`))
          : Promise.resolve({ questions: [] }),
      ]
      const results = await Promise.all(fetches)
      const allQs = results.flatMap((d: any) => d.questions ? d.questions.map(processQ) : [])
      for (let i = allQs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQs[i], allQs[j]] = [allQs[j], allQs[i]]
      }
      onLoad(allQs.length ? allQs : [])
    } catch { onLoad([]) }
  }

  useEffect(() => {
    loadBatch(qs => {
      if (qs.length === 0) { dispatch({ type: 'ERROR', msg: 'Failed to load questions.' }); return }
      dispatch({ type: 'LOADED', questions: qs })
      questionStartRef.current = Date.now()
    })
  }, []) // eslint-disable-line

  useEffect(() => {
    if (state.fetchingMore) return
    if (['loading', 'finished', 'submitting', 'error'].includes(state.status)) return
    const remaining = state.questions.length - state.currentIndex - 1
    if (remaining > PREFETCH_AT) return
    dispatch({ type: 'MORE_LOADING' })
    loadBatch(qs => dispatch({ type: 'MORE_LOADED', questions: qs }))
  }, [state.currentIndex, state.questions.length, state.fetchingMore, state.status]) // eslint-disable-line

  // Wikipedia fact
  useEffect(() => {
    if (state.status === 'playing' || state.status === 'waiting_more') {
      setWikiSummary('idle'); wikiAbortRef.current?.abort(); return
    }
    if (state.status !== 'revealed') return
    const q = state.questions[state.currentIndex]
    if (q.explanation) return
    const ans = q.correct_answer
    if (ans === 'True' || ans === 'False') return

    // If the answer is a number, year, or very short word (≤4 chars), searching
    // Wikipedia for it would return the number's own page, not the topic.
    // Instead, strip the question down to its most searchable noun phrase.
    const isBarren = /^\d+$/.test(ans.trim()) || ans.trim().length <= 4
    const searchTerm = isBarren ? questionToSearchTerm(q.question) : ans

    const ctrl = new AbortController()
    wikiAbortRef.current = ctrl
    setWikiSummary('loading')
    fetch(wikiUrl(searchTerm), { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => setWikiSummary(data.extract && data.type !== 'disambiguation' ? truncate(data.extract) : 'idle'))
      .catch(() => setWikiSummary('idle'))
    return () => ctrl.abort()
  }, [state.status, state.currentIndex, state.questions])

  const handleAnswer = useCallback((option: string) => {
    if (state.status !== 'playing') return
    dispatch({ type: 'SELECT', answer: option, timeTaken: Date.now() - questionStartRef.current })
  }, [state.status])

  const handleNext = useCallback(() => {
    dispatch({ type: 'NEXT' })
    questionStartRef.current = Date.now()
  }, [])

  async function saveAnswers(answers: typeof state.answers) {
    const newAnswers = answers.slice(savedCountRef.current)
    if (newAnswers.length === 0 && sessionIdRef.current) return  // nothing new to save
    if (savingRef.current) return
    savingRef.current = true
    const countAtSave = answers.length
    try {
      const res = await fetch('/api/quiz/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_answers: newAnswers,
          all_count: answers.length,
          correct_count: answers.filter(a => a.is_correct).length,
          session_id: sessionIdRef.current,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        sessionIdRef.current = data.session_id
        savedCountRef.current = countAtSave
      }
    } finally {
      savingRef.current = false
    }
  }

  // Auto-save after every answer
  useEffect(() => {
    if (state.answers.length === 0) return
    saveAnswers(state.answers)
  }, [state.answers.length]) // eslint-disable-line

  // Save on page close/navigate away (incremental beacon)
  useEffect(() => {
    const handler = () => {
      const answers = answersRef.current
      const newAnswers = answers.slice(savedCountRef.current)
      if (newAnswers.length === 0 && sessionIdRef.current) return
      const blob = new Blob(
        [JSON.stringify({
          new_answers: newAnswers,
          all_count: answers.length,
          correct_count: answers.filter(a => a.is_correct).length,
          session_id: sessionIdRef.current,
        })],
        { type: 'application/json' }
      )
      navigator.sendBeacon('/api/quiz/save', blob)
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  async function goToStats() {
    await saveAnswers(answersRef.current)
    router.push('/dashboard')
  }

  if (state.status === 'loading') return <Spinner text="Loading questions…" />
  if (state.status === 'waiting_more') return <Spinner text="Loading more questions…" />

  if (state.status === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">😬</div>
          <p className="text-red-400 mb-6">{state.error}</p>
          <button onClick={() => router.push('/')} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">Try again</button>
        </div>
      </div>
    )
  }

  if (state.status === 'finished') {
    const correct = state.answers.filter(a => a.is_correct).length
    const total = state.answers.length
    const acc = Math.round((correct / total) * 100)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">{acc >= 80 ? '🏆' : acc >= 60 ? '👍' : acc >= 40 ? '💪' : '📚'}</div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: accuracyColor(acc) }}>{acc}%</h1>
          <p className="text-gray-400 mb-8">{correct} of {total} correct</p>

          <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800 mb-8 text-left max-h-[55vh] overflow-y-auto">
            {state.answers.map((a, i) => (
              <div key={i} className="px-4 py-4 flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 text-lg">{a.is_correct ? '✅' : '❌'}</span>
                <div className="min-w-0 flex-1">
                  {a.image && <div className="mb-2"><img src={a.image} alt="" className="h-16 w-auto rounded object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} /></div>}
                  <p className="text-sm text-white leading-snug font-medium">{a.question_text}</p>
                  {!a.is_correct && a.player_answer && <p className="text-xs text-red-400 mt-1">Your answer: {a.player_answer}</p>}
                  {!a.is_correct && <p className="text-xs text-green-400 mt-0.5 font-semibold">✓ {a.correct_answer}</p>}
                  {a.explanation && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed border-l-2 border-gray-700 pl-2 italic">{a.explanation}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/quiz/play')} className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold py-3 rounded-xl transition-colors">
              Keep playing
            </button>
            <button onClick={goToStats} className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-colors">
              View stats →
            </button>
          </div>
        </div>
      </div>
    )
  }

  const q = state.questions[state.currentIndex]
  const isRevealed = state.status === 'revealed'
  const correct = state.answers.filter(a => a.is_correct).length
  const total = state.answers.length
  const factText = q.explanation || (typeof wikiSummary === 'string' && wikiSummary !== 'idle' && wikiSummary !== 'loading' ? wikiSummary : null)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top bar */}
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-sm">🧠 QuizIQ</span>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="text-xs text-gray-400 hidden sm:block">{total} answered · {correct} correct</span>
          )}
          {/* Voice mode toggle */}
          <button
            onClick={() => setVoiceMode(v => !v)}
            title={voiceMode ? 'Voice mode on' : 'Enable voice mode (hands-free)'}
            className={`text-xs border px-2.5 py-1.5 rounded-lg transition-colors ${
              voiceMode ? 'border-purple-500 text-purple-300 bg-purple-500/10' : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            {voiceMode
              ? voiceStatus === 'speaking' ? '🔊' : voiceStatus === 'listening' ? '👂' : '🎤'
              : '🎤'}
          </button>
          <button onClick={goToStats} className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors">
            📊 Stats
          </button>
          {total > 0 && (
            <button onClick={() => dispatch({ type: 'FINISH' })} className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors">
              Finish
            </button>
          )}
        </div>
      </div>

      {/* Mobile score strip */}
      {total > 0 && (
        <div className="sm:hidden px-4 py-1 bg-gray-900/60 border-b border-gray-800/60 text-xs text-gray-400 text-center">
          {total} answered · {correct} correct
        </div>
      )}

      {/* Voice status banner */}
      {voiceMode && (
        <div className="px-4 py-1.5 bg-purple-950/40 border-b border-purple-800/30 text-xs text-purple-300 text-center">
          {voiceStatus === 'speaking' ? '🔊 Listening — get ready…' : voiceStatus === 'listening' ? '👂 Say A, B, C or D' : '🎤 Voice mode on — tap 🎤 to disable'}
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${
                q.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                q.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-red-900/50 text-red-400'
              }`}>{q.difficulty}</span>
              <span className="text-xs text-gray-500 truncate">{q.category}</span>
            </div>

            {q.image && (
              <div className="flex justify-center mb-4">
                <QuizImage
                  key={`q-${state.currentIndex}`}
                  src={q.image}
                  className="h-48 w-auto rounded-lg border border-gray-700 object-contain shadow-lg"
                  onSkip={state.status === 'playing' ? () => dispatch({ type: 'SKIP' }) : undefined}
                />
              </div>
            )}
            <p className="text-lg font-semibold text-white leading-snug">{q.question}</p>

            {isRevealed && (
              <div className="mt-4">
                {wikiSummary === 'loading' && !q.explanation ? (
                  <div className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-500 animate-pulse">Loading fact…</p>
                  </div>
                ) : factText ? (
                  <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-lg">
                    <p className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">💡 Did you know</p>
                    <p className="text-sm text-blue-200 leading-relaxed">{factText}</p>
                  </div>
                ) : null}
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
                else if (isSelected) cls = 'border-red-500 bg-red-500/20 text-red-300'
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

          {isRevealed && !voiceMode && (
            <div className="mt-6 flex justify-end">
              <button onClick={handleNext} className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base">
                Next →
              </button>
            </div>
          )}

          {isRevealed && voiceMode && (
            <div className="mt-4 text-center text-xs text-purple-400 animate-pulse">
              Reading result… next question coming up
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
