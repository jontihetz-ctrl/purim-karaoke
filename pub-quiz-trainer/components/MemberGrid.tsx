'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import type { PlayerStats } from '@/types'
import { accuracyColor } from '@/lib/stats'

export default function MemberGrid({ members }: { members: PlayerStats[] }) {
  if (!members.length) return <p className="text-gray-500 text-sm">No team members have played yet.</p>

  const data = [...members]
    .sort((a, b) => b.overall_accuracy - a.overall_accuracy)
    .map(m => ({
      name: m.display_name,
      accuracy: m.overall_accuracy,
      total: m.total_questions,
    }))

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 50, top: 4, bottom: 4 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#d1d5db', fontSize: 13 }} />
        <Tooltip
          formatter={(v: number, _n: string, props) => [`${v}% (${props.payload.total} Qs)`, 'Accuracy']}
          contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8 }}
          labelStyle={{ color: '#f9fafb' }}
        />
        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
          {data.map((d, i) => <Cell key={i} fill={accuracyColor(d.accuracy)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
