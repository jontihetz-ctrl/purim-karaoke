import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span>🧠</span> QuizIQ
        </div>
        <Link href="/auth" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Get started
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 text-brand-500 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          🏆 Built for pub quiz teams
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6 max-w-2xl">
          Train smarter.<br />
          <span className="text-brand-500">Win more pub quizzes.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Your whole team practises individually. QuizIQ turns that into real data —
          who's your history expert, where you're weak as a team, and exactly what to study before next week.
        </p>
        <Link href="/auth" className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-brand-500/20">
          Start training free →
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 max-w-3xl w-full text-left">
          {[
            { icon: '🎯', title: 'Practice daily', body: 'Thousands of questions across 13 categories. New questions added regularly from the world\'s largest trivia database.' },
            { icon: '📊', title: 'Deep analytics', body: 'Category accuracy, answer speed, improvement trends. Know exactly where you\'re strong and where to focus.' },
            { icon: '👥', title: 'Team insights', body: 'See who your category experts are. Find team-wide weak spots. Get a recommended study plan before quiz night.' },
          ].map(f => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
