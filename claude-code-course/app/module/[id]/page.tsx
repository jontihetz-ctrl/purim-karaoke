import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getModule, MODULES, type Block } from '@/lib/modules'

export function generateStaticParams() {
  return MODULES.map(m => ({ id: String(m.id) }))
}

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const mod = getModule(Number(id))
  if (!mod) notFound()

  const prev = MODULES.find(m => m.id === mod.id - 1)
  const next = MODULES.find(m => m.id === mod.id + 1)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors">
            <span>←</span> All modules
          </Link>
          <span className="text-sm text-slate-400">Module {mod.id} of {MODULES.length}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="text-5xl mb-4">{mod.emoji}</div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Module {mod.id}</span>
            <span className="text-xs text-slate-400">⏱ {mod.duration}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{mod.title}</h1>
          <p className="text-lg text-slate-500">{mod.subtitle}</p>
        </div>

        {/* Content blocks */}
        <div className="space-y-6">
          {mod.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-14 pt-8 border-t border-slate-200 flex justify-between gap-4">
          {prev ? (
            <Link href={`/module/${prev.id}`} className="flex-1 max-w-xs bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all group">
              <div className="text-xs text-slate-400 mb-1">← Previous</div>
              <div className="font-semibold text-slate-700 group-hover:text-blue-700 text-sm">{prev.emoji} {prev.title}</div>
            </Link>
          ) : <div />}

          {next ? (
            <Link href={`/module/${next.id}`} className="flex-1 max-w-xs bg-blue-600 border border-blue-600 rounded-xl p-4 hover:bg-blue-700 transition-all group text-right ml-auto">
              <div className="text-xs text-blue-200 mb-1">Next →</div>
              <div className="font-semibold text-white text-sm">{next.emoji} {next.title}</div>
            </Link>
          ) : (
            <Link href="/" className="flex-1 max-w-xs bg-green-600 border border-green-600 rounded-xl p-4 hover:bg-green-700 transition-all text-right ml-auto">
              <div className="text-xs text-green-200 mb-1">🎉 Course complete!</div>
              <div className="font-semibold text-white text-sm">Back to home</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content} />

    case 'tip':
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          {block.label && <div className="text-sm font-semibold text-blue-700 mb-2">💡 {block.label}</div>}
          <TextBlock content={block.content} small />
        </div>
      )

    case 'warning':
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          {block.label && <div className="text-sm font-semibold text-amber-700 mb-2">⚠️ {block.label}</div>}
          <TextBlock content={block.content} small />
        </div>
      )

    case 'exercise':
      return (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
          {block.label && <div className="text-sm font-semibold text-violet-700 mb-3">🏋️ {block.label}</div>}
          <TextBlock content={block.content} small />
        </div>
      )

    case 'command':
      return (
        <div className="relative group">
          <pre className="bg-slate-900 text-green-400 rounded-xl px-5 py-4 font-mono text-sm overflow-x-auto">
            <span className="text-slate-500 select-none">$ </span>{block.content ?? ''}</pre>
          <button
            className="absolute top-3 right-3 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hidden"
            title="Copy"
          >
            copy
          </button>
        </div>
      )

    case 'code':
      return (
        <pre className="bg-slate-900 text-slate-100 rounded-xl px-5 py-4 font-mono text-sm overflow-x-auto">
          {block.label && <div className="text-slate-500 text-xs mb-2">{block.label}</div>}
          {block.content ?? ''}
        </pre>
      )

    case 'checklist':
      return (
        <ul className="space-y-2.5">
          {(block.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
              <InlineCode str={item} />
            </li>
          ))}
        </ul>
      )

    case 'conversation':
      return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {block.label && (
            <div className="bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-500 border-b border-slate-200 uppercase tracking-wide">
              {block.label}
            </div>
          )}
          <div className="bg-white divide-y divide-slate-100">
            {block.exchanges?.map((ex, i) => (
              <div key={i} className={`px-4 py-3.5 ${ex.role === 'you' ? 'bg-white' : 'bg-slate-50'}`}>
                <div className={`text-xs font-semibold mb-1.5 ${ex.role === 'you' ? 'text-blue-600' : 'text-orange-600'}`}>
                  {ex.role === 'you' ? '👤 You' : '🤖 Claude'}
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{ex.text}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'download':
      return (
        <div className="bg-slate-900 rounded-xl p-6 flex items-start gap-4">
          <div className="text-3xl">📁</div>
          <div className="flex-1">
            {block.label && <div className="font-semibold text-white mb-1">{block.label}</div>}
            {block.content && <p className="text-slate-400 text-sm mb-4">{block.content}</p>}
            <a
              href="/practice-data.zip"
              download
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              ⬇️ Download practice-data folder
            </a>
          </div>
        </div>
      )

    default:
      return null
  }
}

function TextBlock({ content, small }: { content?: string; small?: boolean }) {
  if (!content) return null
  const sizeClass = small ? 'text-sm' : 'text-base'
  const lines = content.split('\n')

  return (
    <div className={`${sizeClass} leading-relaxed text-slate-700 space-y-1`}>
      {lines.map((line, i) => {
        if (line.trim() === '') return <br key={i} />
        return <p key={i}><InlineCode str={line} /></p>
      })}
    </div>
  )
}

function InlineCode({ str }: { str: string }) {
  const parts = str.split(/(`[^`]+`|\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-[0.85em] font-mono">{part.slice(1, -1)}</code>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
