'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function BackgroundScene() {
  const { viewport } = useThree()
  const particlesRef = useRef<THREE.Points>(null)

  // Create massive particle system - 15,000 stars
  const particles = useMemo(() => {
    const count = 15000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Create layered cosmic distribution
      const layer = Math.random()
      let radius
      if (layer < 0.2) {
        radius = 10 + Math.random() * 30  // Inner stars
      } else if (layer < 0.5) {
        radius = 40 + Math.random() * 50  // Middle stars
      } else if (layer < 0.8) {
        radius = 90 + Math.random() * 60  // Outer stars
      } else {
        radius = 150 + Math.random() * 100  // Distant stars
      }

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi) * 0.3

      // Deep space colors with more variety
      const colorChoice = Math.random()
      if (colorChoice < 0.25) {
        colors[i3] = 0.02
        colors[i3 + 1] = 0.01
        colors[i3 + 2] = 0.03
      } else if (colorChoice < 0.45) {
        colors[i3] = 0.15
        colors[i3 + 1] = 0.05
        colors[i3 + 2] = 0.3
      } else if (colorChoice < 0.65) {
        colors[i3] = 0.0
        colors[i3 + 1] = 0.2
        colors[i3 + 2] = 0.4
      } else if (colorChoice < 0.82) {
        colors[i3] = 0.0
        colors[i3 + 1] = 0.4
        colors[i3 + 2] = 0.6
      } else {
        colors[i3] = 0.4
        colors[i3 + 1] = 0.3
        colors[i3 + 2] = 0.8  // Bright distant stars
      }

      sizes[i] = Math.random() * 0.045 + 0.008
    }

    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return

    const time = state.clock.getElapsedTime()

    // Rotate entire particle system
    particlesRef.current.rotation.y = time * 0.02
    particlesRef.current.rotation.x = Math.sin(time * 0.05) * 0.1
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export function BlackHole({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // Pulsing effect
    const scale = 1 + Math.sin(time * 1.5) * 0.08

    // Scroll-based position - black hole moves toward camera and zooms
    const scrollOffset = scrollProgress * 20  // Move 20 units closer
    const zoomScale = 1 + scrollProgress * 3  // Zoom in 3x

    if (groupRef.current) {
      groupRef.current.scale.set(scale * zoomScale, scale * zoomScale, scale * zoomScale)
      groupRef.current.position.z = scrollOffset
      groupRef.current.rotation.z = time * 0.3 + scrollProgress * Math.PI * 2
      groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.2 + scrollProgress * 0.5
    }
  })

  return (
    <group ref={groupRef}>
      {/* Core black hole */}
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.98} />
      </mesh>

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary accretion disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 6.5, 64]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary accretion ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 10, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.3]}>
        <ringGeometry args={[10, 16, 64]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Distant ring */}
      <mesh position={[0, 0, -0.5]}>
        <ringGeometry args={[16, 25, 64]} />
        <meshBasicMaterial
          color="#14b8a6"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

export function CosmicRings({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // Scroll-based rotation - faster as we travel through
    const rotationSpeed = 1 + scrollProgress * 3

    groupRef.current.rotation.x = Math.sin(time * 0.15 * rotationSpeed) * 0.4
    groupRef.current.rotation.y = time * 0.06 * rotationSpeed
    groupRef.current.rotation.z = time * 0.03 * rotationSpeed

    // Move away as we zoom in
    groupRef.current.position.z = -10 - scrollProgress * 30
  })

  return (
    <group ref={groupRef}>
      {/* Inner cosmic rings */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[12 + i * 4, 12 + i * 4 + 0.15, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#10b981' : '#8b5cf6'}
            transparent
            opacity={0.12 - i * 0.02}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Outer galactic structure */}
      {[...Array(6)].map((_, i) => (
        <mesh key={`outer-${i}`} rotation={[Math.PI / 2, i * 0.3, 0]}>
          <ringGeometry args={[28 + i * 5, 28 + i * 5 + 0.2, 64]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#3b82f6' : '#f43f5e'}
            transparent
            opacity={0.06 - i * 0.008}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export function NebulaClouds({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    const rotationSpeed = 1 + scrollProgress * 2

    groupRef.current.children.forEach((cloud, i) => {
      cloud.rotation.z = time * 0.1 * rotationSpeed + i * 0.2
      cloud.rotation.x = Math.sin(time * 0.05 + i * 0.1) * 0.3
    })

    // Move away faster as we travel through
    groupRef.current.position.z = -30 - scrollProgress * 50
  })

  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => (
        <group
          key={i}
          position={[
            Math.cos(i * Math.PI / 4) * 50,
            Math.sin(i * Math.PI / 4) * 50,
            -30 - Math.random() * 20
          ]}
        >
          {[...Array(20)].map((_, j) => (
            <mesh
              key={j}
              position={[
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 5
              ]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[2 + Math.random() * 3, 2 + Math.random() * 3 + 0.3, 32]} />
              <meshBasicMaterial
                color={[0x10b981, 0x8b5cf6, 0x3b82f6, 0xf43f5e][i % 4]}
                transparent
                opacity={0.03 + Math.random() * 0.05}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
