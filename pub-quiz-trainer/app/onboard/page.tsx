'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function OnboardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillCode = searchParams.get('join') || ''

  const [step, setStep] = useState<'name' | 'team'>('name')
  const [displayName, setDisplayName] = useState('')
  const [teamChoice, setTeamChoice] = useState<'create' | 'join'>(prefillCode ? 'join' : 'create')
  const [teamName, setTeamName] = useState('')
  const [inviteCode, setInviteCode] = useState(prefillCode.toUpperCase())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleName(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    setLoading(true)
    const res = await fetch('/api/player/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: displayName.trim() }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) setError(data.error)
    else setStep('team')
  }

  async function handleTeam(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const endpoint = teamChoice === 'create' ? '/api/team/create' : '/api/team/join'
    const body = teamChoice === 'create' ? { name: teamName } : { invite_code: inviteCode }
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) setError(data.error)
    else router.push('/quiz/play')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🧠</div>
          <h1 className="text-2xl font-bold text-white">Let's get you set up</h1>
        </div>

        {step === 'name' ? (
          <form onSubmit={handleName} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Your name (shown to teammates)</label>
              <input
                autoFocus
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Jonti"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Saving…' : 'Continue →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTeam} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            {!prefillCode && (
              <div className="flex rounded-lg overflow-hidden border border-gray-700">
                {(['create', 'join'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setTeamChoice(opt)}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${teamChoice === opt ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    {opt === 'create' ? '➕ Create team' : '🔗 Join team'}
                  </button>
                ))}
              </div>
            )}

            {teamChoice === 'create' ? (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Team name</label>
                <input
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="e.g. The Brainy Bunch"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  {prefillCode ? 'Joining with invite code:' : 'Invite code'}
                </label>
                <input
                  required
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. XK9M2F"
                  readOnly={!!prefillCode}
                  className={`w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors font-mono tracking-widest ${prefillCode ? 'opacity-70 cursor-not-allowed' : ''}`}
                  maxLength={6}
                />
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Loading…' : teamChoice === 'create' ? 'Create team & start playing' : 'Join team & start playing'}
            </button>

            {!prefillCode && (
              <button
                type="button"
                onClick={() => router.push('/quiz/play')}
                className="w-full text-gray-500 hover:text-gray-300 text-sm py-1 transition-colors"
              >
                Skip for now
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default function OnboardPage() {
  return <Suspense fallback={null}><OnboardInner /></Suspense>
}
