'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import type { CategoryStat } from '@/types'
import { accuracyColor } from '@/lib/stats'

export default function CategoryBars({ stats }: { stats: CategoryStat[] }) {
  if (!stats.length) return <p className="text-gray-500 text-sm">No data yet — play some quizzes!</p>

  const data = stats.map(s => ({
    name: s.category.replace('Entertainment: ', '').replace('Science & ', ''),
    accuracy: s.accuracy,
    total: s.total,
  }))

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 40, top: 4, bottom: 4 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#d1d5db', fontSize: 12 }} />
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
