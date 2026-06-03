import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuizIQ — Team Pub Quiz Trainer',
  description: 'Train smarter. Win more pub quizzes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">{children}</body>
    </html>
  )
}
