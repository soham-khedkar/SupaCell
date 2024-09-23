'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import Image from 'next/image'

interface Troop {
  id: number
  name: string
  count: number
  imageUrl: string
}

export default function Attack() {
  const [user, setUser] = useState<any>(null)
  const [troops, setTroops] = useState<Troop[]>([])
  const [selectedTroops, setSelectedTroops] = useState<Troop[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Fetch user's troops from completed_training
        const { data: troopsData } = await supabase
          .from('completed_training')
          .select('troop_id, count')
          .eq('user_id', user.id)

        if (troopsData) {
          const troopsWithDetails = await Promise.all(troopsData.map(async (troop: { troop_id: number, count: number }) => {
            const { data: troopDetails } = await supabase
              .from('troops')
              .select('name, image_url')
              .eq('id', troop.troop_id)
              .single()

            return {
              id: troop.troop_id,
              name: troopDetails?.name || '',
              count: troop.count,
              imageUrl: troopDetails?.image_url || ''
            }
          }))
          setTroops(troopsWithDetails)
        }
      }
    }
    getUser()
  }, [supabase])

  const selectTroop = (troop: Troop) => {
    if (selectedTroops.find(t => t.id === troop.id)) {
      setSelectedTroops(selectedTroops.filter(t => t.id !== troop.id))
    } else {
      setSelectedTroops([...selectedTroops, troop])
    }
  }

  const launchAttack = () => {
    // Implement attack logic here
    console.log('Attacking with troops:', selectedTroops)
  }

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl font-bold mb-8 text-center">Attack Enemy Base</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Troops</h2>
            <div className="grid grid-cols-2 gap-4">
              {troops.map(troop => (
                <div
                  key={troop.id}
                  className={`bg-gray-800 p-4 rounded-lg cursor-pointer ${
                    selectedTroops.find(t => t.id === troop.id) ? 'border-2 border-blue-500' : ''
                  }`}
                  onClick={() => selectTroop(troop)}
                >
                  <Image
                    src={troop.imageUrl}
                    alt={troop.name}
                    width={100}
                    height={100}
                    className="mx-auto mb-2"
                  />
                  <p className="text-center">{troop.name}</p>
                  <p className="text-center">Count: {troop.count}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Enemy Base</h2>
            <div className="bg-gray-800 p-4 rounded-lg h-64 flex items-center justify-center">
              <p>Enemy base visualization goes here</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={launchAttack} disabled={selectedTroops.length === 0}>
            Launch Attack
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}