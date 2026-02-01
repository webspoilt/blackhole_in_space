'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, MeshDistortMaterial, Float } from '@react-three/drei'

export function EncryptedCube({ scale = 1 }: { scale?: number }) {
  const meshRef = useRef<any>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()

    // Complex rotation
    meshRef.current.rotation.x = time * 0.3
    meshRef.current.rotation.y = time * 0.5
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.1
  })

  return (
    <Float
      rotationIntensity={hovered ? 0.5 : 0.2}
      floatIntensity={hovered ? 0.6 : 0.3}
      speed={hovered ? 3 : 1.5}
    >
      <Box
        ref={meshRef}
        args={[scale, scale, scale]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color="#10b981"
          distort={hovered ? 0.4 : 0.2}
          speed={hovered ? 3 : 1.5}
          roughness={0.3}
          metalness={0.7}
          wireframe={false}
        />
      </Box>

      {/* Outer wireframe */}
      <Box args={[scale * 1.2, scale * 1.2, scale * 1.2]}>
        <meshBasicMaterial
          color="#059669"
          wireframe
          transparent
          opacity={0.3}
        />
      </Box>
    </Float>
  )
}
