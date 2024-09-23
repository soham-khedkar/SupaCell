'use client'

import { useState, useRef, Suspense } from 'react'
import { Vector3, Euler } from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Environment, Sky } from '@react-three/drei'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'

interface BuildingProps {
  position: Vector3
  rotation: Euler
  scale: Vector3
  type: string
}

const Building = ({ position, rotation, scale, type }: BuildingProps) => {
  const { scene } = useGLTF(`/models/${type}.glb`)
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />
}

const Base = () => {
  const [buildings, setBuildings] = useState<BuildingProps[]>([])
  const { camera } = useThree()

  const addBuilding = (type: string) => {
    const newBuilding: BuildingProps = {
      type,
      position: new Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10),
      rotation: new Euler(0, Math.random() * Math.PI * 2, 0),
      scale: new Vector3(0.5, 0.5, 0.5),
    }
    setBuildings([...buildings, newBuilding])
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4a7023" />
      </mesh>
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}
      <Html position={[0, 5, 0]}>
        <div className="bg-black bg-opacity-50 p-2 rounded">
          <Button onClick={() => addBuilding('townhall')} className="mr-2">Add Town Hall</Button>
          <Button onClick={() => addBuilding('barracks')} className="mr-2">Add Barracks</Button>
          <Button onClick={() => addBuilding('goldmine')}>Add Gold Mine</Button>
        </div>
      </Html>
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
          <Canvas camera={{ position: [0, 10, 20] }} shadows>
            <Suspense fallback={null}>
              <Base />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </div>
      </main>
      <Footer />
    </div>
  )
}