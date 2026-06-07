'use client'
import { useState } from 'react'

export default function InviteCard({ code, teamName }: { code: string; teamName: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    const link = `${window.location.origin}/onboard?join=${code}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-gray-900 border border-brand-500/30 rounded-xl p-5">
      <h2 className="font-semibold text-white mb-1">Invite teammates to {teamName}</h2>
      <p className="text-gray-400 text-xs mb-4">Share this code — teammates enter it when signing up.</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 flex items-center gap-3">
          <span className="text-xs text-gray-500 uppercase tracking-widest">Code</span>
          <span className="font-mono font-bold text-white tracking-widest">{code}</span>
        </div>
        <button
          onClick={copy}
          className="flex-shrink-0 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
