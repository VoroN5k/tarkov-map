'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CreateSquadModalProps {
  onClose: () => void
  onCreate: (name: string) => Promise<unknown>
  onJoin: (code: string) => Promise<unknown>
}

type Tab = 'create' | 'join'

export function CreateSquadModal({ onClose, onCreate, onJoin }: CreateSquadModalProps) {
  const [tab, setTab] = useState<Tab>('create')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'create') {
        if (!name.trim()) { setError('Введіть назву загону'); setLoading(false); return }
        await onCreate(name.trim())
      } else {
        if (!code.trim()) { setError('Введіть код запрошення'); setLoading(false); return }
        await onJoin(code.trim().toUpperCase())
      }
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Щось пішло не так')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100">Загін</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg leading-none">×</button>
        </div>

        <div className="flex border-b border-zinc-800">
          {(['create', 'join'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2.5 text-sm transition-colors ${
                tab === t
                  ? 'text-amber-400 border-b-2 border-amber-400 font-medium'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'create' ? 'Створити' : 'Приєднатись'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          {tab === 'create' ? (
            <Input
              label="Назва загону"
              placeholder="Alpha Squad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              autoFocus
            />
          ) : (
            <Input
              label="Код запрошення"
              placeholder="AX4K9Z"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="tracking-widest font-mono text-center text-lg"
              autoFocus
            />
          )}

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button type="submit" loading={loading} className="w-full mt-1">
            {tab === 'create' ? 'Створити загін' : 'Приєднатись'}
          </Button>
        </form>
      </div>
    </div>
  )
}
