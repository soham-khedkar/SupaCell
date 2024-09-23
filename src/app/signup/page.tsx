'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Input} from '../components/ui/input'
import { Button } from '../components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user }, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('An account already exists with this email. Try signing in instead.')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <main className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold text-white text-center">Sign Up</h1>
          <form onSubmit={handleSignUp} className="space-y-6">
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
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </Button>
            <p className="mt-4 text-center text-white">
              Already have an account?{' '}
              <Link href="/signin" className="text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  )
}