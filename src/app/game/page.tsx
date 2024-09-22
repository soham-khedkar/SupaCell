'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '../components/ui/button'
import { BackgroundBeams } from '../components/ui/background-beams'
import { TextGenerateEffect } from '../components/ui/text-generate-effect'
import { CardBody, CardContainer, CardItem } from '../components/ui/3d-card'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function Game() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/signin')
      }
    }
    getUser()
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <BackgroundBeams />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center">
          <TextGenerateEffect words="Welcome to Supacell" />
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GameOption
            title="Train Troops"
            description="Strengthen your army by training powerful troops."
            buttonText="Train Troops"
            buttonColor="bg-blue-600 hover:bg-blue-700"
            imageUrl="https://media.giphy.com/media/yVTQIC1obLhWU/giphy.gif"
            link="/train-troops"
          />
          <GameOption
            title="Attack Base"
            description="Launch an attack on enemy bases and claim victory."
            buttonText="Attack"
            buttonColor="bg-red-600 hover:bg-red-700"
            imageUrl="https://media.giphy.com/media/l49JNDd5GFXjmHFeg/giphy.gif"
            link="/attack"
          />
          <GameOption
            title="Build Base"
            description="Construct and upgrade your base defenses."
            buttonText="Build Base"
            buttonColor="bg-green-600 hover:bg-green-700"
            imageUrl="https://media.giphy.com/media/Z9aV9pm8fiiOY/giphy.gif"
            link="/build-base"
          />
          <GameOption
            title="Join Clan"
            description="Team up with other players and form a powerful clan."
            buttonText="Join Clan"
            buttonColor="bg-purple-600 hover:bg-purple-700"
            imageUrl="https://media.giphy.com/media/L1fMIqeN3LJmnRYUxh/giphy.gif"
            link="/join-clan"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface GameOptionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  imageUrl: string;
  link: string;
}

function GameOption({ title, description, buttonText, buttonColor, imageUrl, link }: GameOptionProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-800 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-white">
          {title}
        </CardItem>
        <CardItem as="p" translateZ="60" className="text-neutral-300 text-sm mt-2">
          {description}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <Button asChild className={`w-full ${buttonColor}`}>
            <Link href={link}>{buttonText}</Link>
          </Button>
        </CardItem>
      </CardBody>
      <Image
        src={imageUrl}
        alt={`${title} GIF`}
        width={500}
        height={300}
        className="w-full h-auto rounded-xl mt-4"
      />
    </CardContainer>
  )
}