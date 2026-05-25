'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Squad } from '@/types'

export function useSquad() {
  const [squad, setSquad] = useState<Squad | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSquad = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/squads/me')
    if (res.ok) {
      const data = await res.json()
      setSquad(data)
    } else if (res.status !== 404) {
      setError('Не вдалося завантажити загін')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSquad()
  }, [fetchSquad])

  const createSquad = useCallback(async (name: string) => {
    const res = await fetch('/api/squads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Помилка створення загону')
    }
    const data: Squad = await res.json()
    setSquad(data)
    return data
  }, [])

  const joinSquad = useCallback(async (inviteCode: string) => {
    const res = await fetch('/api/squads/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Неправильний код запрошення')
    }
    const data: Squad = await res.json()
    setSquad(data)
    return data
  }, [])

  const leaveSquad = useCallback(async () => {
    const res = await fetch('/api/squads/leave', { method: 'POST' })
    if (res.ok) setSquad(null)
  }, [])

  return { squad, loading, error, createSquad, joinSquad, leaveSquad, refetch: fetchSquad }
}
