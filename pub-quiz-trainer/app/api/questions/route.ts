import { NextRequest, NextResponse } from 'next/server'
import { fetchQuestions } from '@/lib/trivia'
import { generateFlagQuestions } from '@/lib/flags'
import { generateImageQuestions, type ImageSubtype } from '@/lib/image-questions'

const IMAGE_SUBTYPES = new Set<ImageSubtype>([
  'faces', 'places', 'artworks', 'sports', 'music', 'film',
  'leaders', 'royals', 'comedians', 'inventors', 'tv', 'fashion',
])

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const amount = Math.min(30, Math.max(5, parseInt(searchParams.get('amount') || '10')))
  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const type = searchParams.get('type') || 'multiple'

  if (type === 'flags') {
    return NextResponse.json({ questions: generateFlagQuestions(amount) })
  }
  if (IMAGE_SUBTYPES.has(type as ImageSubtype)) {
    return NextResponse.json({ questions: generateImageQuestions(amount, type as ImageSubtype) })
  }

  try {
    const questions = await fetchQuestions(amount, category || undefined, difficulty || undefined, type === 'boolean' ? 'boolean' : 'multiple')
    return NextResponse.json({ questions })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
