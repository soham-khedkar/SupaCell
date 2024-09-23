'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Environment, Sky } from '@react-three/drei'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import Image from 'next/image'

interface Troop {
  id: number
  name: string
  count: number
  imageUrl: string
  damage: number
  position?: THREE.Vector3
}

interface Building {
  id: number
  type: string
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  health: number
  maxHealth: number
}

const TroopModel = React.forwardRef<THREE.Object3D, {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  type: string
  onPointerDown?: (e: React.PointerEvent) => void
  onPointerUp?: (e: React.PointerEvent) => void
}>(({ position, rotation, scale, type, onPointerDown, onPointerUp }, ref) => {
  const { scene } = useGLTF(`/models/${type}.glb`)
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} ref={ref} onPointerDown={onPointerDown} onPointerUp={onPointerUp} />
})

const BuildingModel: React.FC<{
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  type: string
  health: number
  maxHealth: number
}> = ({ position, rotation, scale, type, health, maxHealth }) => {
  const { scene } = useGLTF(`/models/${type}.glb`)
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      <Html position={[0, 2, 0]}>
        <div className="bg-black bg-opacity-50 p-1 rounded text-white text-xs">
          HP: {health}/{maxHealth}
        </div>
      </Html>
    </group>
  )
}

const DraggableTroop: React.FC<{
  troop: Troop
  onDeploy: (troop: Troop, position: THREE.Vector3) => void
}> = ({ troop, onDeploy }) => {
  const [isDragging, setIsDragging] = useState(false)
  const { camera, raycaster, scene } = useThree()
  const troopRef = useRef<THREE.Object3D>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    setIsDragging(true)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation()
    setIsDragging(false)
    if (troopRef.current) {
      onDeploy(troop, troopRef.current.position)
    }
  }

  useFrame(() => {
    if (isDragging && troopRef.current) {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      if (intersects.length > 0) {
        troopRef.current.position.copy(intersects[0].point)
      }
    }
  })

  return (
    <TroopModel
      ref={troopRef}
      type={troop.name.toLowerCase()}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[0.2, 0.2, 0.2]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  )
}

const AttackScene: React.FC<{
  troops: Troop[]
  onDeploy: (troop: Troop, position: THREE.Vector3) => void
  buildings: Building[]
  onBuildingDestroyed: (buildingId: number) => void
}> = ({ troops, onDeploy, buildings, onBuildingDestroyed }) => {
  useFrame(() => {
    troops.forEach((troop) => {
      if (troop.position) {
        buildings.forEach((building) => {
          const distance = troop.position?.distanceTo(building.position) ?? Infinity
          if (distance < 2) {
            building.health -= troop.damage * 0.016 // Assuming 60 FPS
            if (building.health <= 0) {
              onBuildingDestroyed(building.id)
            }
          }
        })
      }
    })
  })

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
      {troops.map((troop) => (
        <DraggableTroop key={troop.id} troop={troop} onDeploy={onDeploy} />
      ))}
      {buildings.map((building) => (
        <BuildingModel
          key={building.id}
          position={building.position.toArray() as [number, number, number]}
          rotation={building.rotation.toArray() as [number, number, number]}
          scale={building.scale.toArray() as [number, number, number]}
          type={building.type}
          health={building.health}
          maxHealth={building.maxHealth}
        />
      ))}
    </>
  )
}

export default function Attack() {
  const [user, setUser] = useState<any>(null)
  const [troops, setTroops] = useState<Troop[]>([])
  const [deployedTroops, setDeployedTroops] = useState<Troop[]>([])
  const [buildings, setBuildings] = useState<Building[]>([
    { id: 1, type: 'townhall', position: new THREE.Vector3(0, 0, 0), rotation: new THREE.Euler(), scale: new THREE.Vector3(1, 1, 1), health: 1000, maxHealth: 1000 },
    { id: 2, type: 'barracks', position: new THREE.Vector3(5, 0, 5), rotation: new THREE.Euler(), scale: new THREE.Vector3(0.8, 0.8, 0.8), health: 500, maxHealth: 500 },
    { id: 3, type: 'goldmine', position: new THREE.Vector3(-5, 0, -5), rotation: new THREE.Euler(), scale: new THREE.Vector3(0.6, 0.6, 0.6), health: 300, maxHealth: 300 },
  ])
  const [isBaseDestroyed, setIsBaseDestroyed] = useState(false)
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
          const troopsWithDetails = await Promise.all(troopsData.map(async (troop) => {
            const { data: troopDetails } = await supabase
              .from('troops')
              .select('name, image_url, damage')
              .eq('id', troop.troop_id)
              .single()
            return {
              id: troop.troop_id,
              name: troopDetails?.name || '',
              count: troop.count,
              imageUrl: troopDetails?.image_url || '',
              damage: troopDetails?.damage || 0,
            }
          }))
          setTroops(troopsWithDetails.filter(troop => ['barbarian', 'archer', 'wizard'].includes(troop.name.toLowerCase())))
        }
      }
    }
    getUser()
  }, [supabase])

  const handleDeploy = (troop: Troop, position: THREE.Vector3) => {
    const deployedTroop = { ...troop, position, count: 1 }
    setDeployedTroops([...deployedTroops, deployedTroop])
    setTroops(troops.map(t => t.id === troop.id ? { ...t, count: t.count - 1 } : t).filter(t => t.count > 0))
  }

  const handleBuildingDestroyed = (buildingId: number) => {
    setBuildings(buildings.filter(b => b.id !== buildingId))
    if (buildings.length === 1) {
      setIsBaseDestroyed(true)
    }
  }

  if (!user) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl font-bold mb-8 text-center">Attack the Enemy Base</h1>
        <div className="h-[60vh] w-full">
          <Canvas camera={{ position: [0, 5, 10] }}>
            <Suspense fallback={null}>
              <AttackScene troops={deployedTroops} onDeploy={handleDeploy} buildings={buildings} onBuildingDestroyed={handleBuildingDestroyed} />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </div>
      </main>
      <Footer />
    </div>
  )
}