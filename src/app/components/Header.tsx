import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '../components/ui/button'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'react-feather'

export default function Header() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <header className="flex justify-between items-center p-4 text-white z-20 relative">
      <Link href="/" className="text-2xl font-bold">
        Supacell
      </Link>
      <nav className="hidden md:flex space-x-4">
        {user ? (
          <>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/train-troops">Train Troops</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/attack">Attack</Link>
            </Button>
            <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
              <Link href="/build-base">Build Base</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/join-clan">Join Clan</Link>
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </nav>
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 bg-black bg-opacity-75 z-30 flex flex-col items-center justify-center space-y-4"
          >
               <button className="absolute top-4 right-4" onClick={toggleMenu}>
              <X size={24} />
            </button>
            {user ? (
              <>
                <Button asChild className="bg-pink-600 hover:bg-pink-700">
                  <Link href="/train-troops" onClick={toggleMenu}>Train Troops</Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/attack" onClick={toggleMenu}>Attack</Link>
                </Button>
                <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
                  <Link href="/build-base" onClick={toggleMenu}>Build Base</Link>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/join-clan" onClick={toggleMenu}>Join Clan</Link>
                </Button>
                <Button className="bg-red-600 hover:bg-red-700" onClick={() => { handleSignOut(); toggleMenu(); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/signin" onClick={toggleMenu}>Sign In</Link>
                </Button>
                <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
                  <Link href="/signup" onClick={toggleMenu}>Sign Up</Link>
                </Button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}