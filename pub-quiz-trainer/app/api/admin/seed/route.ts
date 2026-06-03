import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PRESET_PLAYERS, TEAM_ID, TEAM_NAME, TEAM_INVITE_CODE } from '@/lib/players'

const CATEGORIES = [
  'General Knowledge', 'Books', 'Film', 'Music', 'Television',
  'Video Games', 'Science & Nature', 'Sports', 'Geography', 'History', 'Art', 'Animals', 'Flags',
]
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

// Each player's strength categories (higher accuracy) and weaknesses (lower)
const PLAYER_PROFILES: Record<string, { strengths: string[]; weaknesses: string[]; speed: number }> = {
  jonti:  { strengths: ['General Knowledge', 'History'],       weaknesses: ['Video Games', 'Animals'], speed: 1.0 },
  ben:    { strengths: ['Science & Nature', 'General Knowledge'], weaknesses: ['Sports', 'Music'],      speed: 1.2 },
  sarah:  { strengths: ['Geography', 'Flags', 'Art'],           weaknesses: ['Video Games', 'Sports'],  speed: 0.9 },
  mike:   { strengths: ['History', 'Books'],                    weaknesses: ['Video Games', 'Music'],   speed: 1.4 },
  emma:   { strengths: ['Film', 'Television', 'Music'],         weaknesses: ['Sports', 'Science & Nature'], speed: 0.8 },
  tom:    { strengths: ['Sports', 'General Knowledge'],         weaknesses: ['Art', 'Books'],            speed: 0.7 },
  lisa:   { strengths: ['Music', 'Art', 'Television'],          weaknesses: ['Science & Nature', 'Geography'], speed: 1.0 },
  josh:   { strengths: ['Flags', 'Geography'],                  weaknesses: ['History', 'Books'],        speed: 0.85 },
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function accuracyForCategory(name: string, category: string): number {
  const profile = PLAYER_PROFILES[name.toLowerCase()] || PLAYER_PROFILES['jonti']
  if (profile.strengths.includes(category)) return rand(72, 92)
  if (profile.weaknesses.includes(category)) return rand(30, 55)
  return rand(50, 75)
}

function generateAnswers(sessionId: string, playerId: string, category: string, difficulty: string, count: number) {
  const playerName = PRESET_PLAYERS.find(p => p.id === playerId)?.name || 'jonti'
  const accuracy = accuracyForCategory(playerName, category) / 100
  const profile = PLAYER_PROFILES[playerName.toLowerCase()] || PLAYER_PROFILES['jonti']
  const baseTime = 12000 * profile.speed

  const sampleAnswers: Record<string, string[]> = {
    'General Knowledge': ['What is the capital of France?', 'How many continents are there?', 'What is the largest ocean?'],
    'History': ['Who was the first US President?', 'When did World War II end?', 'What empire did Julius Caesar lead?'],
    'Science & Nature': ['What is the chemical symbol for gold?', 'How many bones in the human body?', 'What planet is closest to the sun?'],
    'Geography': ['What is the longest river?', 'Which country has the most land area?', 'What ocean borders South America to the west?'],
    'Music': ['Who sang Bohemian Rhapsody?', 'What instrument has 88 keys?', 'Which band was Mick Jagger in?'],
    'Film': ['Who directed Pulp Fiction?', 'What year did Titanic release?', 'Who played Iron Man?'],
    'Sports': ['How many players in a football team?', 'What country invented cricket?', 'Who has the most Olympic gold medals?'],
    'Flags': ['Which country does this flag belong to?', 'What flag has a maple leaf?', 'Which flag is the oldest?'],
    'Art': ['Who painted the Mona Lisa?', 'What movement did Picasso co-found?', 'Where is the Louvre?'],
    'Television': ['What show features Walter White?', 'Who played Tony Soprano?', 'In what city does The Simpsons take place?'],
    'Books': ['Who wrote Harry Potter?', 'What is the best-selling book of all time?', 'Who wrote 1984?'],
    'Video Games': ['What year did Minecraft release?', 'Who is the main character in Zelda?', 'What company made Mario?'],
    'Animals': ['How many legs does a spider have?', 'What is the largest land animal?', 'What is a group of lions called?'],
  }

  const questions = sampleAnswers[category] || sampleAnswers['General Knowledge']
  const rows = []

  for (let i = 0; i < count; i++) {
    const is_correct = Math.random() < accuracy
    const time_taken_ms = Math.max(2000, Math.floor(baseTime + rand(-5000, 8000)))
    const qText = questions[i % questions.length]
    rows.push({
      session_id: sessionId,
      player_id: playerId,
      question_text: qText,
      category,
      difficulty,
      correct_answer: 'Paris',
      player_answer: is_correct ? 'Paris' : 'Berlin',
      is_correct,
      time_taken_ms,
    })
  }
  return rows
}

export async function POST() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const results: string[] = []

  // Create team first
  await supabase.from('quiz_teams').upsert({
    id: TEAM_ID,
    name: TEAM_NAME,
    invite_code: TEAM_INVITE_CODE,
    owner_id: PRESET_PLAYERS[0].id,
  })
  results.push(`Team created: ${TEAM_NAME}`)

  for (const player of PRESET_PLAYERS) {
    // Create auth user
    const { data: existing } = await supabase.auth.admin.getUserById(player.id)
    if (!existing?.user) {
      const { error: createErr } = await supabase.auth.admin.createUser({
        id: player.id,
        email: player.email,
        password: 'pubquiz2024!',
        email_confirm: true,
        user_metadata: { display_name: player.name },
      })
      if (createErr) {
        results.push(`Auth error for ${player.name}: ${createErr.message}`)
        continue
      }
    }

    // Create quiz_players record
    await supabase.from('quiz_players').upsert({
      id: player.id,
      display_name: player.name,
      team_id: TEAM_ID,
    })

    // Seed sessions + answers
    const sessionCategories = [...CATEGORIES, ...CATEGORIES.slice(0, 5)]
    let totalSessions = 0

    for (const cat of sessionCategories.slice(0, rand(10, 15))) {
      const diff = DIFFICULTIES[rand(0, 2)]
      const qCount = rand(8, 15)
      const answers = generateAnswers('placeholder', player.id, cat, diff, qCount)
      const correctCount = answers.filter(a => a.is_correct).length
      const daysAgo = rand(1, 60)
      const sessionDate = new Date(Date.now() - daysAgo * 86400000).toISOString()

      const { data: session } = await supabase.from('quiz_sessions').insert({
        player_id: player.id,
        team_id: TEAM_ID,
        category: cat,
        difficulty: diff,
        total_questions: qCount,
        correct_count: correctCount,
        completed_at: sessionDate,
        created_at: sessionDate,
      }).select().single()

      if (session) {
        const rows = generateAnswers(session.id, player.id, cat, diff, qCount)
        await supabase.from('quiz_answers').insert(rows)
        totalSessions++
      }
    }

    results.push(`${player.name}: ${totalSessions} sessions seeded`)
  }

  return NextResponse.json({ ok: true, results })
}
