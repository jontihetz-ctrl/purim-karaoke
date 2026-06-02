export interface Team {
  id: string
  name: string
  invite_code: string
  owner_id: string
  created_at: string
}

export interface Profile {
  id: string
  display_name: string
  team_id: string | null
  created_at: string
  teams?: Team
}

export interface QuizSession {
  id: string
  player_id: string
  team_id: string | null
  category: string | null
  difficulty: string | null
  total_questions: number
  correct_count: number
  completed_at: string | null
  created_at: string
}

export interface QuizAnswer {
  id: string
  session_id: string
  player_id: string
  question_text: string
  category: string
  difficulty: string
  correct_answer: string
  player_answer: string
  is_correct: boolean
  time_taken_ms: number
  created_at: string
}

export interface TriviaQuestion {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface CategoryStat {
  category: string
  total: number
  correct: number
  accuracy: number
  avg_time_ms: number
}

export interface PlayerStats {
  player_id: string
  display_name: string
  total_questions: number
  correct_count: number
  overall_accuracy: number
  avg_time_ms: number
  category_stats: CategoryStat[]
  sessions_count: number
}

export interface TeamStats {
  weakest: CategoryStat[]
  strongest: CategoryStat[]
  category_experts: Record<string, string>
  members: PlayerStats[]
}

export const CATEGORIES = [
  { id: '', label: 'Any Category', emoji: '🎲' },
  { id: '9', label: 'General Knowledge', emoji: '🧠' },
  { id: '10', label: 'Books', emoji: '📚' },
  { id: '11', label: 'Film', emoji: '🎬' },
  { id: '12', label: 'Music', emoji: '🎵' },
  { id: '14', label: 'Television', emoji: '📺' },
  { id: '15', label: 'Video Games', emoji: '🎮' },
  { id: '17', label: 'Science & Nature', emoji: '🔬' },
  { id: '21', label: 'Sports', emoji: '⚽' },
  { id: '22', label: 'Geography', emoji: '🌍' },
  { id: '23', label: 'History', emoji: '📜' },
  { id: '25', label: 'Art', emoji: '🎨' },
  { id: '27', label: 'Animals', emoji: '🦁' },
]

export const DIFFICULTIES = [
  { id: '', label: 'Mixed' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
]
