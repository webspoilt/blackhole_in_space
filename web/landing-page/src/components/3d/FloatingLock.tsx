'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus, Circle } from '@react-three/drei'
import * as THREE from 'three'

export function FloatingLock({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    // Gentle floating
    groupRef.current.position.y = Math.sin(time * 0.8) * 0.1 * scale

    // Rotation
    groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2

    // Subtle bobbing
    groupRef.current.position.x = Math.sin(time * 0.5) * 0.05 * scale
  })

  return (
    <group ref={groupRef} scale={scale}>
      {/* Lock body */}
      <Sphere args={[0.8, 32, 32]} position={[0, -0.2, 0]}>
        <meshStandardMaterial
          color="#10b981"
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>

      {/* Shackle */}
      <Torus args={[0.4, 0.08, 16, 32, Math.PI]} position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color="#34d399"
          roughness={0.2}
          metalness={0.8}
        />
      </Torus>

      {/* Keyhole glow */}
      <Circle args={[0.15, 32]} position={[0, -0.2, 0.82]}>
        <meshBasicMaterial
          color="#059669"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Circle>

      {/* Outer protective rings */}
      <Torus args={[1.1, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          color="#065f46"
          transparent
          opacity={0.4}
        />
      </Torus>

      <Torus args={[1.3, 0.015, 16, 64]} rotation={[Math.PI / 2, 0.3, 0]}>
        <meshBasicMaterial
          color="#047857"
          transparent
          opacity={0.2}
        />
      </Torus>
    </group>
  )
}
