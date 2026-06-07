import { NextRequest, NextResponse } from 'next/server'
import { fetchQuestions } from '@/lib/trivia'
import { generateFlagQuestions } from '@/lib/flags'
import { generateImageQuestions } from '@/lib/image-questions'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const amount = Math.min(30, Math.max(5, parseInt(searchParams.get('amount') || '10')))
  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''
  const type = searchParams.get('type') || 'multiple'

  if (type === 'flags') {
    return NextResponse.json({ questions: generateFlagQuestions(amount) })
  }
  if (type === 'faces') {
    return NextResponse.json({ questions: generateImageQuestions(amount, 'faces') })
  }
  if (type === 'places') {
    return NextResponse.json({ questions: generateImageQuestions(amount, 'places') })
  }
  if (type === 'artworks') {
    return NextResponse.json({ questions: generateImageQuestions(amount, 'artworks') })
  }

  try {
    const questions = await fetchQuestions(amount, category || undefined, difficulty || undefined, type === 'boolean' ? 'boolean' : 'multiple')
    return NextResponse.json({ questions })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
