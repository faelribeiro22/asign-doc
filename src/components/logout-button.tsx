'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-sm"
    >
      <Icons.logout className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
}
