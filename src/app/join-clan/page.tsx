'use client'

import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function JoinClan() {
  useEffect(() => {
    const card = document.querySelector('.coming-soon-card') as HTMLElement
    if (card) {
      let position = 0
      const animateBorder = () => {
        position = (position + 1) % 200
        card.style.backgroundPosition = `${position}% 0%`
        requestAnimationFrame(animateBorder)
      }
      animateBorder()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative flex items-center justify-center">
        <div className="coming-soon-card bg-gray-800 p-8 rounded-lg shadow-lg text-center relative overflow-hidden">
          <h1 className="text-4xl font-bold mb-4">Join a Clan</h1>
          <p className="text-xl mb-4">Coming Soon!</p>
          <p>Get ready to team up with other players and dominate the battlefield.</p>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .coming-soon-card {
          background-image: linear-gradient(90deg, #4a5568 50%, #2d3748 50%);
          background-size: 200% 100%;
          animation: borderAnimation 2s linear infinite;
        }
        @keyframes borderAnimation {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </div>
  )
}