'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { BackgroundBeams } from '../components/ui/background-beams'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message === 'Invalid login credentials') {
        toast.error('User does not exist. Redirecting to Sign Up...')
        setTimeout(() => {
          router.push('/signup')
        }, 3000)
      } else {
        console.error('Error signing in:', error.message)
      }
    } else {
      router.push('/game')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <BackgroundBeams />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Sign In to Supacell
          </h1>
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}