import { NextRequest, NextResponse } from 'next/server'
import { fetchQuestions } from '@/lib/trivia'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const amount = Math.min(30, Math.max(5, parseInt(searchParams.get('amount') || '10')))
  const category = searchParams.get('category') || ''
  const difficulty = searchParams.get('difficulty') || ''

  try {
    const questions = await fetchQuestions(amount, category || undefined, difficulty || undefined)
    return NextResponse.json({ questions })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
