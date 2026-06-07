import type { TriviaQuestion } from '@/types'

export function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&[a-z]+;/gi, '') // strip any remaining unknown entities
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildOptions(q: TriviaQuestion): string[] {
  return shuffleArray([q.correct_answer, ...q.incorrect_answers].map(decodeHtml))
}

export async function fetchQuestions(
  amount: number,
  category?: string,
  difficulty?: string,
  type: 'multiple' | 'boolean' = 'multiple'
): Promise<TriviaQuestion[]> {
  const params = new URLSearchParams({ amount: String(amount), type })
  if (category) params.set('category', category)
  if (difficulty) params.set('difficulty', difficulty)

  const res = await fetch(`https://opentdb.com/api.php?${params}`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error('Failed to fetch questions')

  const data = await res.json()
  if (data.response_code !== 0) throw new Error(`OTDB error: ${data.response_code}`)

  return data.results as TriviaQuestion[]
}
