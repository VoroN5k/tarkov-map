'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Невірний email або пароль')
      setLoading(false)
      return
    }

    router.push('/map/customs')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🗺</div>
        <h1 className="text-2xl font-bold text-zinc-100">Tarkov Map</h1>
        <p className="text-zinc-500 text-sm mt-1">Тактична карта для вашого загону</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-zinc-100 mb-5">Увійти</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="operator@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full mt-1">
            Увійти
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-500">
          Немає акаунту?{' '}
          <Link href="/register" className="text-amber-400 hover:text-amber-300">
            Реєстрація
          </Link>
        </div>
      </div>
    </div>
  )
}
