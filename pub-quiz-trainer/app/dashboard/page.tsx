import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getEffectiveUser } from '@/lib/supabase/server'
import { buildPlayerStats, buildTeamStats, accuracyColor, getPlayerTitle } from '@/lib/stats'
import CategoryBars from '@/components/CategoryBars'
import AccuracyTrend from '@/components/AccuracyTrend'
import InviteCard from '@/components/InviteCard'
import MemberGrid from '@/components/MemberGrid'
import type { QuizAnswer, QuizSession } from '@/types'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  let userId: string, db: Awaited<ReturnType<typeof getEffectiveUser>>['db']
  try { ({ userId, db } = await getEffectiveUser()) }
  catch { redirect('/auth') }

  const { data: profile } = await db
    .from('quiz_players')
    .select('*, quiz_teams(*)')
    .eq('id', userId)
    .single()

  if (!profile) redirect('/onboard')

  const { data: sessions } = await db
    .from('quiz_sessions')
    .select('*')
    .eq('player_id', userId)
    .order('created_at', { ascending: false })

  const { data: answers } = await db
    .from('quiz_answers')
    .select('*')
    .eq('player_id', userId)

  const stats = buildPlayerStats(
    userId,
    profile.display_name,
    (answers as QuizAnswer[]) ?? [],
    (sessions ?? []).length
  )

  const allSessions = (sessions ?? []) as QuizSession[]
  const recentSessions = allSessions.slice(0, 5)

  const diffStats = {
    easy: (answers ?? []).filter((a: QuizAnswer) => a.difficulty === 'easy'),
    medium: (answers ?? []).filter((a: QuizAnswer) => a.difficulty === 'medium'),
    hard: (answers ?? []).filter((a: QuizAnswer) => a.difficulty === 'hard'),
  }

  // Team stats
  let teamSection = null
  if (profile.team_id) {
    const { data: members } = await db
      .from('quiz_players')
      .select('id, display_name')
      .eq('team_id', profile.team_id)

    const { data: allAnswers } = await db
      .from('quiz_answers')
      .select('*')
      .in('player_id', (members ?? []).map(m => m.id))

    const { data: allTeamSessions } = await db
      .from('quiz_sessions')
      .select('*')
      .eq('team_id', profile.team_id)

    const memberStats = (members ?? []).map(m => {
      const ma = ((allAnswers ?? []) as QuizAnswer[]).filter(a => a.player_id === m.id)
      const ms = ((allTeamSessions ?? []) as QuizSession[]).filter(s => s.player_id === m.id)
      return buildPlayerStats(m.id, m.display_name, ma, ms.length)
    })

    const teamStats = buildTeamStats(memberStats)
    const totalTeamQ = memberStats.reduce((s, m) => s + m.total_questions, 0)
    const teamAcc = totalTeamQ > 0
      ? Math.round(memberStats.reduce((s, m) => s + m.correct_count, 0) / totalTeamQ * 100)
      : 0

    const teamCategoryMap = new Map<string, { total: number; correct: number }>()
    for (const m of memberStats) {
      for (const cs of m.category_stats) {
        if (!teamCategoryMap.has(cs.category)) teamCategoryMap.set(cs.category, { total: 0, correct: 0 })
        const s = teamCategoryMap.get(cs.category)!
        s.total += cs.total; s.correct += cs.correct
      }
    }
    const teamCategoryStats = Array.from(teamCategoryMap.entries())
      .map(([category, s]) => ({ category, total: s.total, correct: s.correct, accuracy: s.total > 0 ? Math.round(s.correct / s.total * 100) : 0, avg_time_ms: 0 }))
      .sort((a, b) => b.total - a.total)

    const team = profile.quiz_teams as { id: string; name: string; invite_code: string; owner_id: string }

    teamSection = { memberStats, teamStats, totalTeamQ, teamAcc, teamCategoryStats, team, allTeamSessionsCount: (allTeamSessions ?? []).length }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">🧠 QuizIQ</div>
        <div className="flex items-center gap-4">
          <Link href="/quiz/play" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Play →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── PERSONAL STATS ─────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">👤 My Stats — {profile.display_name}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{stats.sessions_count} sessions · {stats.total_questions} questions answered</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              {getPlayerTitle(stats)}
            </div>
          </div>

          {stats.total_questions > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Overall accuracy', value: `${stats.overall_accuracy}%`, color: accuracyColor(stats.overall_accuracy) },
                  { label: 'Questions', value: stats.total_questions.toLocaleString(), color: '#6c63ff' },
                  { label: 'Correct', value: stats.correct_count.toLocaleString(), color: '#22c55e' },
                  { label: 'Avg speed', value: stats.avg_time_ms ? `${(stats.avg_time_ms / 1000).toFixed(1)}s` : '—', color: '#eab308' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {(['easy', 'medium', 'hard'] as const).map(d => {
                  const set = diffStats[d]
                  const acc = set.length ? Math.round(set.filter((a: QuizAnswer) => a.is_correct).length / set.length * 100) : null
                  return (
                    <div key={d} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                      <div className="capitalize text-gray-400 text-xs mb-1">{d}</div>
                      <div className="text-xl font-bold" style={{ color: acc != null ? accuracyColor(acc) : '#4b5563' }}>
                        {acc != null ? `${acc}%` : '—'}
                      </div>
                      <div className="text-gray-500 text-xs">{set.length} Qs</div>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h2 className="font-semibold text-white mb-4">Accuracy by category</h2>
                  <CategoryBars stats={stats.category_stats} />
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h2 className="font-semibold text-white mb-4">Accuracy trend</h2>
                  <AccuracyTrend sessions={allSessions} />
                </div>
              </div>

              {recentSessions.length > 0 && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h2 className="font-semibold text-white mb-4">Recent sessions</h2>
                  <div className="space-y-2">
                    {recentSessions.map(s => {
                      const acc = s.total_questions > 0 ? Math.round((s.correct_count / s.total_questions) * 100) : 0
                      return (
                        <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                          <div>
                            <span className="text-sm text-white">{s.category || 'Mixed'}</span>
                            <span className="text-gray-500 text-xs ml-2">{s.difficulty || 'mixed'} · {s.total_questions} Qs</span>
                          </div>
                          <div className="font-semibold text-sm" style={{ color: accuracyColor(acc) }}>
                            {s.correct_count}/{s.total_questions} ({acc}%)
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-400 mb-4">Play your first quiz to see your stats appear here.</p>
              <Link href="/quiz/play" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block">
                Start playing →
              </Link>
            </div>
          )}
        </div>

        {/* ── TEAM STATS ─────────────────────────────────────────────── */}
        <div className="border-t border-gray-800 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">👥 Team Stats</h2>
            {profile.quiz_teams && (
              <Link href="/team" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                Full team page →
              </Link>
            )}
          </div>

          {teamSection ? (
            <>
              {profile.quiz_teams && profile.quiz_teams.owner_id === userId && (
                <div className="mb-6">
                  <InviteCard code={teamSection.team.invite_code} teamName={teamSection.team.name} />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Team accuracy', value: teamSection.totalTeamQ > 0 ? `${teamSection.teamAcc}%` : '—', color: teamSection.teamAcc > 0 ? accuracyColor(teamSection.teamAcc) : '#4b5563' },
                  { label: 'Total questions', value: teamSection.totalTeamQ.toLocaleString(), color: '#6c63ff' },
                  { label: 'Members', value: teamSection.memberStats.length, color: '#22c55e' },
                  { label: 'Sessions', value: teamSection.allTeamSessionsCount, color: '#eab308' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {teamSection.totalTeamQ > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5">
                      <h3 className="font-semibold text-red-300 mb-3">⚠️ Team weak spots</h3>
                      {teamSection.teamStats.weakest.length > 0 ? (
                        <div className="space-y-2">
                          {teamSection.teamStats.weakest.map(w => (
                            <div key={w.category} className="flex justify-between items-center">
                              <span className="text-sm text-gray-300 truncate">{w.category.replace('Entertainment: ', '')}</span>
                              <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: accuracyColor(w.accuracy) }}>{w.accuracy}%</span>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-gray-500 text-sm">Not enough data yet.</p>}
                    </div>
                    <div className="bg-green-950/30 border border-green-900/50 rounded-xl p-5">
                      <h3 className="font-semibold text-green-300 mb-3">💪 Team strengths</h3>
                      {teamSection.teamStats.strongest.length > 0 ? (
                        <div className="space-y-2">
                          {teamSection.teamStats.strongest.map(s => (
                            <div key={s.category} className="flex justify-between items-center">
                              <span className="text-sm text-gray-300 truncate">{s.category.replace('Entertainment: ', '')}</span>
                              <span className="text-sm font-bold ml-2 flex-shrink-0" style={{ color: accuracyColor(s.accuracy) }}>{s.accuracy}%</span>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-gray-500 text-sm">Not enough data yet.</p>}
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
                    <h3 className="font-semibold text-white mb-4">🏆 Leaderboard</h3>
                    <MemberGrid members={teamSection.memberStats} />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-4">You&apos;re not on a team yet.</p>
              <Link href="/onboard" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block">
                Create or join a team →
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
