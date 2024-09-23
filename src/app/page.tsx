'use client'

import { motion } from 'framer-motion'
import { Button } from '../app/components/ui/button'
import { BackgroundBeams } from '../app/components/ui/background-beams'
import { SparklesCore } from '../app/components/ui/sparkles'
import Link from 'next/link'
import Image from 'next/image'
import Footer from './components/Footer'
import { useSession } from '@supabase/auth-helpers-react'
import Header from './components/Header'

export default function Home() {
  const session = useSession()
  const user = session?.user
  return (
    
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Header/>
      <BackgroundBeams />
      <main className="flex-grow container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
        
          <motion.p className="text-xl mb-8 relative inline-block"
          initial={{ backgroundSize: '0% 100%' }}
          animate={{ backgroundSize: '100% 100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            backgroundImage: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '0 100%',
            backgroundSize: '100% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Build your base, train your troops, and battle against other players in this exciting multiplayer game!
          </motion.p>
          <div className="relative w-full h-64 mb-8">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
            <Image
              src="https://media.giphy.com/media/guYFNGzLjNWi4jsrnm/giphy.gif?cid=790b76114uq4lpiuusg6kzx71llab0ygaanxq1qqy554bida&ep=v1_gifs_search&rid=giphy.gif&ct=g"
              alt="Clash of Clans inspired gif"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
          <div className="space-x-4">
            {!user ? (
              <>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <Link href="/signup">Sign Up</Link>
            </Button>
            </>
            ) : (
              <>
              <div className='space-between flex flex-row'>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Link href="/">Sign out</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded">
              <Link href="/game">Game</Link>
            </Button>
            </div>
            </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}