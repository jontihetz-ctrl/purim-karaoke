import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getEffectiveUser } from '@/lib/supabase/server'
import { buildPlayerStats, buildTeamStats, accuracyColor } from '@/lib/stats'
import CategoryBars from '@/components/CategoryBars'
import MemberGrid from '@/components/MemberGrid'
import type { QuizAnswer, QuizSession } from '@/types'

export default async function TeamPage() {
  const { userId, db } = await getEffectiveUser()

  const { data: profile } = await db
    .from('quiz_players')
    .select('*, quiz_teams(*)')
    .eq('id', userId)
    .single()

  if (!profile) redirect('/onboard')
  if (!profile.team_id) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-white mb-2">You're not on a team yet</h2>
          <p className="text-gray-400 mb-6">Create or join a team to see team stats.</p>
          <Link href="/onboard" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Set up team
          </Link>
        </div>
      </div>
    )
  }

  // All members of this team
  const { data: members } = await db
    .from('quiz_players')
    .select('id, display_name')
    .eq('team_id', profile.team_id)

  // All answers for this team
  const { data: allAnswers } = await db
    .from('quiz_answers')
    .select('*')
    .in('player_id', (members ?? []).map(m => m.id))

  // All sessions for this team
  const { data: allSessions } = await db
    .from('quiz_sessions')
    .select('*')
    .eq('team_id', profile.team_id)

  const memberStats = (members ?? []).map(m => {
    const answers = ((allAnswers ?? []) as QuizAnswer[]).filter(a => a.player_id === m.id)
    const sessions = ((allSessions ?? []) as QuizSession[]).filter(s => s.player_id === m.id)
    return buildPlayerStats(m.id, m.display_name, answers, sessions.length)
  })

  const teamStats = buildTeamStats(memberStats)
  const team = profile.quiz_teams as { id: string; name: string; invite_code: string }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  const totalTeamQuestions = memberStats.reduce((s, m) => s + m.total_questions, 0)
  const teamAccuracy = totalTeamQuestions > 0
    ? Math.round(memberStats.reduce((s, m) => s + m.correct_count, 0) / totalTeamQuestions * 100)
    : 0

  // Aggregate team category stats
  const teamCategoryMap = new Map<string, { total: number; correct: number; avg_time_ms: number }>()
  for (const m of memberStats) {
    for (const cs of m.category_stats) {
      if (!teamCategoryMap.has(cs.category)) teamCategoryMap.set(cs.category, { total: 0, correct: 0, avg_time_ms: 0 })
      const s = teamCategoryMap.get(cs.category)!
      s.total += cs.total
      s.correct += cs.correct
    }
  }
  const teamCategoryStats = Array.from(teamCategoryMap.entries()).map(([category, s]) => ({
    category,
    total: s.total,
    correct: s.correct,
    accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    avg_time_ms: 0,
  })).sort((a, b) => b.total - a.total)

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
          <span className="font-bold">🧠 QuizIQ</span>
        </div>
        <Link href="/quiz" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Play quiz
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Team header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">👥 {team.name}</h1>
            <p className="text-gray-400 text-sm mt-1">{memberStats.length} members · {totalTeamQuestions.toLocaleString()} questions answered</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm">
            <p className="text-gray-400 text-xs mb-1">Invite code</p>
            <p className="font-mono font-bold text-brand-500 text-lg tracking-widest">{team.invite_code}</p>
            {appUrl && <p className="text-gray-500 text-xs mt-1">{appUrl}/onboard</p>}
          </div>
        </div>

        {/* Team top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Team accuracy', value: totalTeamQuestions > 0 ? `${teamAccuracy}%` : '—', color: teamAccuracy > 0 ? accuracyColor(teamAccuracy) : '#4b5563' },
            { label: 'Total questions', value: totalTeamQuestions.toLocaleString(), color: '#6c63ff' },
            { label: 'Members', value: memberStats.length, color: '#22c55e' },
            { label: 'Sessions played', value: (allSessions ?? []).length, color: '#eab308' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-gray-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {totalTeamQuestions > 0 ? (
          <>
            {/* Team intelligence section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5">
                <h2 className="font-semibold text-red-300 mb-3">⚠️ Team weak spots</h2>
                {teamStats.weakest.length > 0 ? (
                  <div className="space-y-2">
                    {teamStats.weakest.map(w => (
                      <div key={w.category} className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 truncate">{w.category.replace('Entertainment: ', '')}</span>
                        <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: accuracyColor(w.accuracy) }}>{w.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Not enough data yet.</p>}
              </div>

              <div className="bg-green-950/30 border border-green-900/50 rounded-xl p-5">
                <h2 className="font-semibold text-green-300 mb-3">💪 Team strengths</h2>
                {teamStats.strongest.length > 0 ? (
                  <div className="space-y-2">
                    {teamStats.strongest.map(s => (
                      <div key={s.category} className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 truncate">{s.category.replace('Entertainment: ', '')}</span>
                        <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: accuracyColor(s.accuracy) }}>{s.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-sm">Not enough data yet.</p>}
              </div>
            </div>

            {/* Category experts */}
            {Object.keys(teamStats.category_experts).length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
                <h2 className="font-semibold text-white mb-4">⭐ Category experts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(teamStats.category_experts).slice(0, 9).map(([cat, name]) => (
                    <div key={cat} className="bg-gray-800 rounded-lg p-3">
                      <p className="text-gray-400 text-xs truncate">{cat.replace('Entertainment: ', '')}</p>
                      <p className="text-white text-sm font-semibold mt-0.5 truncate">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member leaderboard */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
              <h2 className="font-semibold text-white mb-4">🏆 Member leaderboard</h2>
              <MemberGrid members={memberStats} />
            </div>

            {/* Member detail cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {memberStats
                .sort((a, b) => b.overall_accuracy - a.overall_accuracy)
                .map(m => (
                  <div key={m.player_id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{m.display_name}</h3>
                      <span className="text-lg font-bold" style={{ color: accuracyColor(m.overall_accuracy) }}>
                        {m.total_questions > 0 ? `${m.overall_accuracy}%` : '—'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div><div className="text-white font-semibold">{m.total_questions}</div><div className="text-gray-500">Questions</div></div>
                      <div><div className="text-white font-semibold">{m.sessions_count}</div><div className="text-gray-500">Sessions</div></div>
                      <div><div className="text-white font-semibold">{m.avg_time_ms ? `${(m.avg_time_ms / 1000).toFixed(1)}s` : '—'}</div><div className="text-gray-500">Avg speed</div></div>
                    </div>
                    {m.category_stats.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {m.category_stats.slice(0, 3).map(cs => (
                          <div key={cs.category} className="flex justify-between text-xs">
                            <span className="text-gray-400 truncate">{cs.category.replace('Entertainment: ', '')}</span>
                            <span className="font-medium ml-2 flex-shrink-0" style={{ color: accuracyColor(cs.accuracy) }}>{cs.accuracy}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Team category breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="font-semibold text-white mb-4">Team accuracy by category</h2>
              <CategoryBars stats={teamCategoryStats} />
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-white mb-2">No team data yet</h2>
            <p className="text-gray-400 mb-6">Invite your teammates and start playing. Stats appear once the team has answered questions.</p>
            <Link href="/quiz" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Start training →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
