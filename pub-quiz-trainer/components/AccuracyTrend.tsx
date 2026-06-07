'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { QuizSession } from '@/types'

export default function AccuracyTrend({ sessions }: { sessions: QuizSession[] }) {
  if (sessions.length < 2) return <p className="text-gray-500 text-sm">Play at least 2 quizzes to see your trend.</p>

  const data = sessions
    .filter(s => s.completed_at)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(-20)
    .map((s, i) => ({
      label: `#${i + 1}`,
      accuracy: Math.round((s.correct_count / s.total_questions) * 100),
    }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
        <Tooltip
          formatter={(v: number) => [`${v}%`, 'Accuracy']}
          contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#f9fafb' }}
        />
        <Line type="monotone" dataKey="accuracy" stroke="#6c63ff" strokeWidth={2} dot={{ fill: '#6c63ff', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
