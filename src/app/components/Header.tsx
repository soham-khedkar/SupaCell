'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '../components/ui/button'
import { User } from '@supabase/supabase-js'

export default function Header() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <header className="flex justify-between items-center p-4  text-white">
      <Link href="/" className="text-2xl font-bold">
        Supacell
      </Link>
      <nav>
        {!user ? (
          <>
            <Button variant="ghost" asChild className="mr-2">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </nav>
    </header>
  )
}