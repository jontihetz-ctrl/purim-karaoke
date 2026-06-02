import type { QuizAnswer, CategoryStat, PlayerStats, TeamStats } from '@/types'

export function computeCategoryStats(answers: QuizAnswer[]): CategoryStat[] {
  const map = new Map<string, { total: number; correct: number; time: number[] }>()

  for (const a of answers) {
    const key = a.category
    if (!map.has(key)) map.set(key, { total: 0, correct: 0, time: [] })
    const s = map.get(key)!
    s.total++
    if (a.is_correct) s.correct++
    s.time.push(a.time_taken_ms)
  }

  return Array.from(map.entries())
    .map(([category, s]) => ({
      category,
      total: s.total,
      correct: s.correct,
      accuracy: Math.round((s.correct / s.total) * 100),
      avg_time_ms: Math.round(s.time.reduce((a, b) => a + b, 0) / s.time.length),
    }))
    .sort((a, b) => b.total - a.total)
}

export function buildPlayerStats(
  player_id: string,
  display_name: string,
  answers: QuizAnswer[],
  sessions_count: number
): PlayerStats {
  const total = answers.length
  const correct = answers.filter(a => a.is_correct).length
  const avg_time_ms = total > 0
    ? Math.round(answers.reduce((s, a) => s + a.time_taken_ms, 0) / total)
    : 0

  return {
    player_id,
    display_name,
    total_questions: total,
    correct_count: correct,
    overall_accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    avg_time_ms,
    category_stats: computeCategoryStats(answers),
    sessions_count,
  }
}

export function buildTeamStats(members: PlayerStats[]): TeamStats {
  // Aggregate category stats across all members (min 5 questions per category)
  const map = new Map<string, { total: number; correct: number }>()
  const expertMap: Record<string, { name: string; acc: number; total: number }> = {}

  for (const m of members) {
    for (const cs of m.category_stats) {
      if (!map.has(cs.category)) map.set(cs.category, { total: 0, correct: 0 })
      const s = map.get(cs.category)!
      s.total += cs.total
      s.correct += cs.correct

      if (cs.total >= 5) {
        const ex = expertMap[cs.category]
        if (!ex || cs.accuracy > ex.acc || (cs.accuracy === ex.acc && cs.total > ex.total)) {
          expertMap[cs.category] = { name: m.display_name, acc: cs.accuracy, total: cs.total }
        }
      }
    }
  }

  const aggregated: CategoryStat[] = Array.from(map.entries())
    .filter(([, s]) => s.total >= 5)
    .map(([category, s]) => ({
      category,
      total: s.total,
      correct: s.correct,
      accuracy: Math.round((s.correct / s.total) * 100),
      avg_time_ms: 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)

  const category_experts: Record<string, string> = {}
  for (const [cat, ex] of Object.entries(expertMap)) {
    category_experts[cat] = ex.name
  }

  return {
    weakest: aggregated.slice(0, 3),
    strongest: [...aggregated].reverse().slice(0, 3),
    category_experts,
    members,
  }
}

export function accuracyColor(pct: number): string {
  if (pct >= 80) return '#22c55e'
  if (pct >= 60) return '#eab308'
  if (pct >= 40) return '#f97316'
  return '#ef4444'
}
