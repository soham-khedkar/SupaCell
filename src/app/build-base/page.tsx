'use client'

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Text } from '@react-three/drei'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

const Building = ({ position, size, color }: BuildingProps) => {
  return (
    <Box position={position} args={size}>
      <meshStandardMaterial color={color} />
    </Box>
  )
}

const Base = () => {
  const [buildings, setBuildings] = useState<BuildingProps[]>([])

  const addBuilding = () => {
    const newBuilding: BuildingProps = {
      position: [Math.random() * 10 - 5, 0, Math.random() * 10 - 5],
      size: [1, Math.random() * 2 + 1, 1],
      color: `hsl(${Math.random() * 360}, 50%, 50%)`
    }
    setBuildings([...buildings, newBuilding])
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <gridHelper args={[20, 20]} />
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}
      <Text
        position={[0, 5, 0]}
        color="white"
        fontSize={0.5}
        maxWidth={200}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        Click the "Add Building" button to build your base!
      </Text>
    </>
  )
}

export default function BuildBase() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl font-bold mb-8 text-center">Build Your Base</h1>
        <div className="h-[60vh] w-full">
          <Canvas camera={{ position: [0, 5, 10] }}>
            <Base />
            <OrbitControls />
          </Canvas>
        </div>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => document.dispatchEvent(new CustomEvent('addBuilding'))}>
            Add Building
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}