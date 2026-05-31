'use client'

import type { SquadMember } from '@/types'

interface MemberListProps {
  members: SquadMember[]
  currentUserId: string
  ownerId: string
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: '★ Командир',
  MEMBER: 'Учасник',
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase()
}

export function MemberList({ members, currentUserId, ownerId }: MemberListProps) {
  if (members.length === 0) {
    return <div className="text-sm text-zinc-500 py-2">Поки немає учасників</div>
  }

  return (
    <div className="flex flex-col gap-1.5">
      {members.map((member) => (
        <div
          key={member.id}
          className={`flex items-center gap-2.5 p-2 rounded ${
            member.userId === currentUserId ? 'bg-zinc-700/50' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300 flex-shrink-0">
            {member.user.avatarUrl ? (
              <img src={member.user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(member.user.username)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-zinc-200 truncate">
              {member.user.username}
              {member.userId === currentUserId && (
                <span className="ml-1 text-xs text-zinc-500">(ти)</span>
              )}
            </div>
            <div className="text-xs text-zinc-500">{ROLE_LABELS[member.role] ?? member.role}</div>
          </div>
          {member.userId === ownerId && (
            <span className="text-amber-400 text-xs">★</span>
          )}
        </div>
      ))}
    </div>
  )
}
