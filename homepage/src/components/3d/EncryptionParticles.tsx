'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function EncryptionParticles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Create a sphere distribution
      const radius = 2 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Emerald/cyan colors with variation
      colors[i3] = 0.1 + Math.random() * 0.2
      colors[i3 + 1] = 0.6 + Math.random() * 0.3
      colors[i3 + 2] = 0.5 + Math.random() * 0.4
    }

    return { positions, colors }
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()

    // Rotate the entire particle system
    mesh.current.rotation.y = time * 0.1
    mesh.current.rotation.x = Math.sin(time * 0.2) * 0.1

    // Pulse effect
    const scale = 1 + Math.sin(time * 0.5) * 0.05
    mesh.current.scale.set(scale, scale, scale)
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
