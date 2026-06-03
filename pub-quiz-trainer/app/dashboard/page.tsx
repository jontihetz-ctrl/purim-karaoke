import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getEffectiveUser } from '@/lib/supabase/server'
import { buildPlayerStats, accuracyColor } from '@/lib/stats'
import CategoryBars from '@/components/CategoryBars'
import AccuracyTrend from '@/components/AccuracyTrend'
import type { QuizAnswer, QuizSession } from '@/types'

export default async function DashboardPage() {
  const { userId, db } = await getEffectiveUser()

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

  const recentSessions = (sessions ?? []).slice(0, 5) as QuizSession[]
  const allSessions = (sessions ?? []) as QuizSession[]

  const diffStats = {
    easy: (answers ?? []).filter((a: QuizAnswer) => a.difficulty === 'easy'),
    medium: (answers ?? []).filter((a: QuizAnswer) => a.difficulty === 'medium'),
    hard: (answers ?? []).filter((a: QuizAnswer) => a.difficulty === 'hard'),
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">🧠 QuizIQ</div>
        <div className="flex items-center gap-4">
          {profile.quiz_teams && (
            <Link href="/team" className="text-gray-400 hover:text-white text-sm transition-colors">
              👥 {profile.quiz_teams.name}
            </Link>
          )}
          <Link href="/quiz" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Play quiz
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Hey, {profile.display_name} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{stats.sessions_count} sessions · {stats.total_questions} questions answered</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Overall accuracy', value: `${stats.overall_accuracy}%`, color: accuracyColor(stats.overall_accuracy) },
            { label: 'Questions answered', value: stats.total_questions.toLocaleString(), color: '#6c63ff' },
            { label: 'Correct answers', value: stats.correct_count.toLocaleString(), color: '#22c55e' },
            { label: 'Avg response time', value: stats.avg_time_ms ? `${(stats.avg_time_ms / 1000).toFixed(1)}s` : '—', color: '#eab308' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-gray-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Difficulty breakdown */}
        {stats.total_questions > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category breakdown */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Accuracy by category</h2>
            <CategoryBars stats={stats.category_stats} />
          </div>

          {/* Trend */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Accuracy trend</h2>
            <AccuracyTrend sessions={allSessions} />
          </div>
        </div>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-white mb-4">Recent sessions</h2>
            <div className="space-y-2">
              {recentSessions.map(s => {
                const acc = Math.round((s.correct_count / s.total_questions) * 100)
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

        {stats.total_questions === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to start?</h2>
            <p className="text-gray-400 mb-6">Play your first quiz to see your stats appear here.</p>
            <Link href="/quiz" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Play first quiz →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
