'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PRESET_PLAYERS } from '@/lib/players'

export default function PlayerSelectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function selectPlayer(id: string) {
    setLoading(id)
    await fetch('/api/player/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: id }),
    })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-3xl font-bold text-white">QuizIQ</h1>
        <p className="text-gray-400 mt-2">Who are you?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
        {PRESET_PLAYERS.map(p => (
          <button
            key={p.id}
            onClick={() => selectPlayer(p.id)}
            disabled={loading !== null}
            className={`bg-gray-900 border rounded-xl p-5 text-center transition-all hover:border-brand-500 hover:bg-brand-500/10 disabled:opacity-50 ${
              loading === p.id ? 'border-brand-500 bg-brand-500/10 scale-95' : 'border-gray-700'
            }`}
          >
            <div className="text-4xl mb-2">{p.emoji}</div>
            <div className="font-bold text-white">{p.name}</div>
            <div className="text-xs text-gray-500 mt-1">{p.bio}</div>
          </button>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-8">Pick your character to see your stats and play</p>
    </div>
  )
}
