'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES, DIFFICULTIES } from '@/types'

const QUIZ_TYPES = [
  { id: 'multiple', label: 'Multiple Choice', emoji: '🧠', desc: 'Classic 4-option questions' },
  { id: 'boolean', label: 'True / False',     emoji: '✅', desc: 'Quick-fire true or false' },
  { id: 'flags',   label: 'Flag Quiz',         emoji: '🚩', desc: 'Identify country flags' },
  { id: 'faces',   label: 'Famous Faces',      emoji: '🤩', desc: 'Who is this person?' },
  { id: 'places',  label: 'Famous Places',     emoji: '📍', desc: 'Where is this landmark?' },
]

export default function QuizSetupPage() {
  const router = useRouter()
  const [quizType, setQuizType] = useState('multiple')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [amount, setAmount] = useState('10')

  const isFlagsOrBool = ['flags', 'boolean', 'faces', 'places'].includes(quizType)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams({ amount, type: quizType })
    if (!isFlagsOrBool) {
      if (category) params.set('category', category)
      if (difficulty) params.set('difficulty', difficulty)
    }
    router.push(`/quiz/play?${params}`)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
        <span className="font-bold">🧠 QuizIQ</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Set up your quiz</h1>
        <p className="text-gray-400 mb-8">Choose your settings and start training.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Quiz type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUIZ_TYPES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setQuizType(t.id)}
                  className={`border rounded-xl p-3 text-left transition-colors ${
                    quizType === t.id
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-medium text-white">{t.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category — hidden for flags/boolean */}
          {!isFlagsOrBool && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`border rounded-lg p-3 text-sm flex items-center gap-2 transition-colors ${
                      category === c.id
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span>{c.emoji}</span>
                    <span className="text-gray-300 truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty — hidden for flags */}
          {quizType !== 'flags' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`flex-1 border rounded-lg py-2.5 text-sm text-gray-300 transition-colors ${
                      difficulty === d.id
                        ? 'border-brand-500 bg-brand-500/10'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Count */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Number of questions</label>
            <div className="flex gap-2">
              {['10', '20', '30'].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setAmount(n)}
                  className={`flex-1 border rounded-lg py-2.5 text-sm text-gray-300 transition-colors ${
                    amount === n
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-brand-500/20 mt-4"
          >
            Start quiz 🎯
          </button>
        </form>
      </div>
    </div>
  )
}
