'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

export function FloatingShield() {
  const mesh = useRef<any>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()

    // Floating animation
    mesh.current.position.y = Math.sin(time * 0.5) * 0.1

    // Subtle rotation
    mesh.current.rotation.y = time * 0.3
    mesh.current.rotation.x = Math.sin(time * 0.2) * 0.1

    // Speed up on hover
    mesh.current.rotation.z = hovered ? time * 0.8 : Math.sin(time * 0.3) * 0.1
  })

  return (
    <group>
      <Sphere
        ref={mesh}
        args={[1.5, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color="#10b981"
          distort={hovered ? 0.6 : 0.4}
          speed={hovered ? 4 : 2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>

      {/* Outer ring */}
      <Sphere args={[1.7, 32, 32]} scale={[1, 1, 0.3]}>
        <meshBasicMaterial
          color="#065f46"
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>

      {/* Inner glowing core */}
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial
          color="#34d399"
          transparent
          opacity={0.5}
          blending="additive"
        />
      </Sphere>
    </group>
  )
}
