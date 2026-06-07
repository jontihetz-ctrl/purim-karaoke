export interface PresetPlayer {
  id: string
  name: string
  emoji: string
  email: string
  bio: string
}

export const PRESET_PLAYERS: PresetPlayer[] = [
  { id: 'a1000000-0000-0000-0000-000000000001', name: 'Jonti',  emoji: '🧠', email: 'jonti@quiz.local',  bio: 'The organiser' },
  { id: 'a1000000-0000-0000-0000-000000000002', name: 'Ben',    emoji: '🔬', email: 'ben@quiz.local',    bio: 'The scientist' },
  { id: 'a1000000-0000-0000-0000-000000000003', name: 'Sarah',  emoji: '🌍', email: 'sarah@quiz.local',  bio: 'The traveller' },
  { id: 'a1000000-0000-0000-0000-000000000004', name: 'Mike',   emoji: '📜', email: 'mike@quiz.local',   bio: 'The historian' },
  { id: 'a1000000-0000-0000-0000-000000000005', name: 'Emma',   emoji: '🎬', email: 'emma@quiz.local',   bio: 'The cinephile' },
  { id: 'a1000000-0000-0000-0000-000000000006', name: 'Tom',    emoji: '⚽', email: 'tom@quiz.local',    bio: 'The sports nut' },
  { id: 'a1000000-0000-0000-0000-000000000007', name: 'Lisa',   emoji: '🎵', email: 'lisa@quiz.local',   bio: 'The music lover' },
  { id: 'a1000000-0000-0000-0000-000000000008', name: 'Josh',   emoji: '🚩', email: 'josh@quiz.local',   bio: 'The flag nerd' },
]

export const TEAM_ID = 'b0000000-0000-0000-0000-000000000001'
export const TEAM_NAME = 'The Quiz Crew'
export const TEAM_INVITE_CODE = 'QZCRW1'
