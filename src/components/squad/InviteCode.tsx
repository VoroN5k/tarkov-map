'use client'

import { useState } from 'react'

interface InviteCodeProps {
  code: string
}

export function InviteCode({ code }: InviteCodeProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
      <div className="text-xs text-zinc-500 mb-1.5">Код запрошення</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 font-mono text-lg font-bold tracking-[0.3em] text-amber-400">
          {code}
        </code>
        <button
          onClick={copy}
          className="px-2 py-1 text-xs rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
        >
          {copied ? '✓ Скопійовано' : 'Копіювати'}
        </button>
      </div>
    </div>
  )
}
