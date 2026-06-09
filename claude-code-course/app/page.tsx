import Link from 'next/link'
import { MODULES } from '@/lib/modules'

const TOTAL_DURATION = '2.5 hrs'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
              <span>🎓</span> Beginner Course
            </div>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
              <span>🌐</span> Web browser only — no downloads
            </div>
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
              <span>✓</span> Requires Claude Pro ($20/mo)
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Claude Code for Auditors
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            A practical crash course on using AI to supercharge your audit work.
            No installation, no terminal, no coding knowledge needed — runs entirely in your browser at claude.ai/code.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span>📚</span>
              <span>{MODULES.length} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>{TOTAL_DURATION} total</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏋️</span>
              <span>5 hands-on exercises</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📁</span>
              <span>Practice data included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Course Modules</h2>
        <div className="space-y-3">
          {MODULES.map((mod, i) => (
            <Link
              key={mod.id}
              href={`/module/${mod.id}`}
              className="flex items-center gap-5 bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-xl flex-shrink-0 transition-colors">
                {mod.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-slate-400 font-medium">Module {i + 1}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-400">{mod.duration}</span>
                </div>
                <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{mod.title}</div>
                <div className="text-sm text-slate-500 mt-0.5 truncate">{mod.subtitle}</div>
              </div>
              <div className="text-slate-300 group-hover:text-blue-400 transition-colors text-lg">→</div>
            </Link>
          ))}
        </div>

        {/* Download CTA */}
        <div className="mt-10 bg-blue-600 rounded-2xl p-8 text-white">
          <div className="text-2xl mb-3">📁</div>
          <h3 className="text-xl font-bold mb-2">Get the Practice Data</h3>
          <p className="text-blue-100 mb-5 leading-relaxed">
            Download the fictional Acme Corp audit dataset — transactions, employee records,
            vendor lists, and a buggy Python script. Used in Modules 4–7.
          </p>
          <a
            href="/practice-data.zip"
            download
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <span>⬇️</span> Download practice-data.zip
          </a>
          <p className="text-blue-200 text-xs mt-3">
            Or browse individual files in the course if you prefer to copy-paste.
          </p>
        </div>

        {/* What you'll learn */}
        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-8">
          <h3 className="font-bold text-slate-800 text-lg mb-4">What you&apos;ll be able to do after this course</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Analyse CSV datasets without knowing Excel formulas',
              'Find SoD violations and self-approvals automatically',
              'Ask Claude to explain code written by others',
              'Write audit scripts in plain English',
              'Fix broken scripts without knowing how to code',
              'Produce professional audit memos in minutes',
              'Run Benford\'s Law checks on any dataset',
              'Stand out in interviews as an AI-savvy auditor',
            ].map(item => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-slate-100 rounded-xl p-5 text-sm text-slate-600">
          <strong className="text-slate-800">Before you start:</strong> Go to <strong>claude.ai</strong> and upgrade to <strong>Pro</strong> ($20/month). Then open <strong>claude.ai/code</strong> in your browser. That&apos;s all the setup you need — no downloads, no IT request, nothing to install.
        </div>

        <p className="text-center text-slate-400 text-sm mt-10">
          Built for auditors going into the job market · Works with Claude Pro · Browser only
        </p>
      </div>
    </div>
  )
}
