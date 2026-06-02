import Link from 'next/link'
import { CATEGORIES, DIFFICULTIES } from '@/types'

export default function QuizSetupPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
        <span className="font-bold">🧠 QuizIQ</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Set up your quiz</h1>
        <p className="text-gray-400 mb-8">Choose your settings and start training.</p>

        <QuizForm />
      </div>
    </div>
  )
}

function QuizForm() {
  return (
    <form action="/quiz/play" method="GET" className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map(c => (
            <label key={c.id} className="relative cursor-pointer">
              <input type="radio" name="category" value={c.id} className="sr-only peer" defaultChecked={c.id === ''} />
              <div className="peer-checked:border-brand-500 peer-checked:bg-brand-500/10 border border-gray-700 rounded-lg p-3 text-sm flex items-center gap-2 hover:border-gray-500 transition-colors">
                <span>{c.emoji}</span>
                <span className="text-gray-300 truncate">{c.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Difficulty</label>
        <div className="flex gap-2">
          {DIFFICULTIES.map(d => (
            <label key={d.id} className="relative cursor-pointer flex-1">
              <input type="radio" name="difficulty" value={d.id} className="sr-only peer" defaultChecked={d.id === ''} />
              <div className="peer-checked:border-brand-500 peer-checked:bg-brand-500/10 border border-gray-700 rounded-lg py-2.5 text-sm text-center text-gray-300 hover:border-gray-500 transition-colors">
                {d.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Count */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Number of questions</label>
        <div className="flex gap-2">
          {[10, 20, 30].map(n => (
            <label key={n} className="relative cursor-pointer flex-1">
              <input type="radio" name="amount" value={String(n)} className="sr-only peer" defaultChecked={n === 10} />
              <div className="peer-checked:border-brand-500 peer-checked:bg-brand-500/10 border border-gray-700 rounded-lg py-2.5 text-sm text-center text-gray-300 hover:border-gray-500 transition-colors">
                {n}
              </div>
            </label>
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
  )
}
