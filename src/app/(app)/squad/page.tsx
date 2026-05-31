import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SquadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const member = await prisma.squadMember.findFirst({
    where: { userId: user.id },
    include: {
      squad: {
        include: {
          members: { include: { user: { select: { username: true } } } },
        },
      },
    },
  })

  if (member) {
    redirect(`/map/customs`)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-5xl mb-4">⚔</div>
        <h1 className="text-xl font-semibold text-zinc-100 mb-2">Ви не в загоні</h1>
        <p className="text-zinc-500 mb-6">Відкрийте карту та створіть або приєднайтесь до загону</p>
        <Link
          href="/map/customs"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded transition-colors"
        >
          Відкрити карту
        </Link>
      </div>
    </div>
  )
}
