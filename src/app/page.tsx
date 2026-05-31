import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/map/customs')

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🗺</div>
        <h1 className="text-4xl font-bold text-zinc-100 mb-2 tracking-tight">
          Tarkov Map
        </h1>
        <p className="text-zinc-400 text-lg mb-8">
          Інтерактивна тактична карта для вашого загону. Ставте мітки ворогів, маршрутів та точок зустрічі в реальному часі.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors"
          >
            Увійти
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg border border-zinc-700 transition-colors"
          >
            Реєстрація
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
          {[
            { icon: '📍', title: 'Реалтайм мітки', desc: 'Ворог, небезпека, зустріч — видно всім учасникам загону' },
            { icon: '✏', title: 'Маршрути', desc: 'Малюйте маршрут прямо на карті' },
            { icon: '⚔', title: 'Загони', desc: 'Запрошуйте друзів 6-символьним кодом' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-medium text-zinc-200 mb-0.5">{title}</div>
              <div className="text-zinc-500 text-xs">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
