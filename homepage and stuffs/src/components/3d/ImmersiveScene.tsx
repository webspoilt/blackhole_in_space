'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BackgroundScene, BlackHole, CosmicRings, NebulaClouds } from './BackgroundScene'

function BackgroundAnimation() {
  const groupRef = useRef<THREE.Group>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = window.scrollY / scrollHeight
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // Rotate entire universe based on scroll - more dramatic
    groupRef.current.rotation.y = time * 0.03 + scrollProgress * Math.PI * 3
    groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.3 + scrollProgress * 0.8

    // Dynamic camera movement through universe
    state.camera.position.y = -scrollProgress * 15
    state.camera.position.x = Math.sin(time * 0.1) * scrollProgress * 3
    state.camera.position.z = 25 + Math.sin(time * 0.05) * 5
  })

  return (
    <group ref={groupRef}>
      <BackgroundScene />
      <BlackHole position={[0, 8, -18]} />
      <CosmicRings position={[0, -8, -12]} />
      <NebulaClouds />
    </group>
  )
}

export function ImmersiveScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={65} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.4}
          minPolarAngle={Math.PI / 3.5}
          rotateSpeed={0.15}
        />

        {/* Deep universe lighting */}
        <ambientLight intensity={0.15} />
        <pointLight position={[25, 25, 25]} intensity={0.8} color="#10b981" />
        <pointLight position={[-25, -25, 25]} intensity={0.6} color="#3b82f6" />
        <pointLight position={[0, 0, -30]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[30, -20, -20]} intensity={0.3} color="#f43f5e" />

        <Environment preset="night" />

        <BackgroundAnimation />
      </Canvas>

      {/* Deep space vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,11,0.5)_30%,rgba(5,5,8,0.95)_60%,#0a0a0b_100%)]" />

      {/* Cosmic scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01]">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)'
        }} />
      </div>

      {/* Stars and distant galaxies overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `
          radial-gradient(1px 1px at 10% 20%, #fff, transparent),
          radial-gradient(1.5px 1.5px at 30% 40%, #fff, transparent),
          radial-gradient(1px 1px at 50% 60%, #fff, transparent),
          radial-gradient(1.5px 1.5px at 70% 30%, #fff, transparent),
          radial-gradient(1px 1px at 85% 50%, #fff, transparent),
          radial-gradient(1px 1px at 15% 75%, #fff, transparent),
          radial-gradient(2px 2px at 60% 15%, #fff, transparent),
          radial-gradient(1px 1px at 40% 85%, #fff, transparent),
          radial-gradient(1.5px 1.5px at 90% 70%, #fff, transparent),
          radial-gradient(1px 1px at 25% 90%, #fff, transparent),
          radial-gradient(2px 2px at 75% 80%, #fff, transparent)
        `,
        backgroundSize: '300px 300px'
      }} />

      {/* Nebula wisps */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-violet-600/10 via-transparent to-emerald-600/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-emerald-600/8 via-transparent to-cyan-600/5 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-rose-600/5 via-transparent to-violet-600/8 rounded-full blur-[120px]" />
      </div>
    </div>
  )
}
