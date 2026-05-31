'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Пароль має бути не менше 6 символів')
      return
    }
    if (username.trim().length < 3) {
      setError('Нікнейм має бути не менше 3 символів')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim() },
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Create profile immediately
    if (data.user) {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-xl font-semibold text-zinc-100 mb-2">Перевірте email</h2>
        <p className="text-zinc-400 text-sm">
          Ми надіслали підтвердження на <strong className="text-zinc-200">{email}</strong>.
          Перейдіть за посиланням у листі для активації.
        </p>
        <Link href="/login" className="inline-block mt-4 text-amber-400 hover:text-amber-300 text-sm">
          ← Повернутись до входу
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🗺</div>
        <h1 className="text-2xl font-bold text-zinc-100">Tarkov Map</h1>
        <p className="text-zinc-500 text-sm mt-1">Тактична карта для вашого загону</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-zinc-100 mb-5">Реєстрація</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Нікнейм"
            placeholder="Operator"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={32}
          />
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
            autoComplete="new-password"
          />

          {error && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full mt-1">
            Створити акаунт
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-500">
          Вже є акаунт?{' '}
          <Link href="/login" className="text-amber-400 hover:text-amber-300">
            Увійти
          </Link>
        </div>
      </div>
    </div>
  )
}
