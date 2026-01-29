'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Scroll momentum tracking
const useScrollMomentum = () => {
  const scrollVelocity = useRef(0)
  const currentScroll = useRef(0)

  return {
    update: () => {
      const newScroll = window.scrollY
      const delta = newScroll - currentScroll.current
      currentScroll.current = newScroll

      // Smooth momentum with decay
      scrollVelocity.current = scrollVelocity.current * 0.95 + delta * 0.002

      return {
        raw: newScroll / (document.documentElement.scrollHeight - window.innerHeight),
        velocity: scrollVelocity.current,
      }
    },
  }
}

export function BackgroundScene() {
  const { viewport } = useThree()
  const particlesRef = useRef<THREE.Points>(null)
  const cursorPos = useRef({ x: 0, y: 0 })
  const targetCursorPos = useRef({ x: 0, y: 0 })
  const scrollMomentum = useScrollMomentum()

  // Keep 15,000 particles for cosmic feel
  const particles = useMemo(() => {
    const count = 15000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)
    const initialPositions = new Float32Array(count * 3)
    const spiralOffsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Cosmic distribution
      const layer = Math.random()
      let radius
      if (layer < 0.25) {
        radius = 3 + Math.random() * 12
      } else if (layer < 0.6) {
        radius = 18 + Math.random() * 35
      } else {
        radius = 55 + Math.random() * 60
      }

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi) * 0.3 // Flatter universe

      initialPositions[i3] = positions[i3]
      initialPositions[i3 + 1] = positions[i3 + 1]
      initialPositions[i3 + 2] = positions[i3 + 2]

      spiralOffsets[i3] = Math.random() * Math.PI * 2

      // Deep space colors
      const colorChoice = Math.random()
      if (colorChoice < 0.3) {
        colors[i3] = 0.02
        colors[i3 + 1] = 0.01
        colors[i3 + 2] = 0.04
      } else if (colorChoice < 0.6) {
        colors[i3] = 0.15
        colors[i3 + 1] = 0.05
        colors[i3 + 2] = 0.08
      } else if (colorChoice < 0.85) {
        colors[i3] = 0.0
        colors[i3 + 1] = 0.2
        colors[i3 + 2] = 0.4
      } else {
        colors[i3] = 0.0
        colors[i3 + 1] = 0.4
        colors[i3 + 2] = 0.6
      }

      sizes[i] = Math.random() * 0.035 + 0.008

      velocities[i3] = (Math.random() - 0.5) * 0.006
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.006
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.0015
    }

    return { positions, colors, sizes, velocities, initialPositions, spiralOffsets }
  }, [])

  // Track cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetCursorPos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!particlesRef.current) return

    const time = state.clock.getElapsedTime()
    const scrollData = scrollMomentum.update()

    // Smooth cursor following
    cursorPos.current.x += (targetCursorPos.current.x - cursorPos.current.x) * 0.04
    cursorPos.current.y += (targetCursorPos.current.y - cursorPos.current.y) * 0.04

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array

    // Supermassive black hole with momentum
    const blackHoleCenter = new THREE.Vector3(
      cursorPos.current.x * 10 + scrollData.velocity * 5,  // Momentum continues when scrolling stops
      cursorPos.current.y * 5 + scrollData.velocity * 3,
      -15
    )
    const blackHoleMass = 80

    // Update all 15,000 particles every frame
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3

      // Get current position
      const pos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2])

      // Complex physics - keep all complexity
      const distToHole = pos.distanceTo(blackHoleCenter)

      // Multi-layer gravitational influence
      const influenceRadius = Math.min(distToHole, 50)
      const influenceFactor = 1 - (distToHole / 50)

      // Velocity-based attraction (stronger when moving toward hole)
      const attraction = (influenceRadius / distToHole) * 0.02

      // Black hole pull with spiral motion
      if (distToHole < 30) {
        const spiralAngle = Math.atan2(pos.y - blackHoleCenter.y, pos.x - blackHoleCenter.x)
        const spiralRadius = Math.max(2, distToHole * 0.1)
        const spiralOffset = spiralOffsets[i3]

        pos.x += Math.cos(spiralAngle + spiralOffset) * attraction * 20
        pos.y += Math.sin(spiralAngle + spiralOffset) * attraction * 20
        pos.z += Math.cos(spiralAngle + spiralOffset) * attraction * 5

        // Stretch near event horizon
        const horizonStretch = Math.max(0.6, 1 - distToHole / 20)
        pos.x *= horizonStretch
        pos.y *= horizonStretch

        // Fade into void
        if (distToHole < 3) {
          const fadeFactor = distToHole / 3
          colors[i3] *= fadeFactor
          colors[i3 + 1] *= fadeFactor
          colors[i3 + 2] *= fadeFactor
        }
      }

      // Add scroll-based motion (independent of black hole)
      const scrollInfluence = Math.abs(scrollData.velocity) * 2
      const scrollTimeOffset = time * scrollInfluence

      // Particle rotates based on time + scroll momentum
      const baseRotation = time * 0.05
      const scrollRotation = scrollInfluence * Math.PI
      const spiralAngle = baseRotation + scrollRotation + spiralOffsets[i3]

      const currentRadius = Math.sqrt(pos.x * pos.x + pos.y * pos.y)
      const scrollOffset = Math.sin(scrollTimeOffset) * 5

      pos.x = Math.cos(spiralAngle) * (currentRadius + scrollOffset)
      pos.y = Math.sin(spiralAngle) * (currentRadius + scrollOffset)

      // Add cosmic drift with scroll influence
      pos.x += velocities[i3] * 0.1 + scrollData.velocity * 3
      pos.y += velocities[i3 + 1] * 0.1 + scrollData.velocity * 2
      pos.z += velocities[i3 + 2] * 0.02 + Math.sin(time * 0.1) * 0.5

      // Dynamic color based on multiple factors
      const distToCenter = pos.length()
      const scrollIntensity = Math.min(1, Math.abs(scrollData.velocity) * 5)

      // Complex color calculation
      const baseIntensity = Math.max(0, 1 - distToCenter / 60)
      const combinedIntensity = Math.min(1, baseIntensity * 0.7 + scrollIntensity * 0.3)
      const speedBoost = Math.abs(velocities[i3]) * 5

      colors[i3] = Math.min(0.25, 0.03 + combinedIntensity * 0.15 + speedBoost)
      colors[i3 + 1] = Math.min(0.5, 0.05 + combinedIntensity * 0.25 + speedBoost * 0.15)
      colors[i3 + 2] = Math.min(0.6, 0.1 + combinedIntensity * 0.4 + speedBoost * 0.25)

      // Update position
      positions[i3] = pos.x
      positions[i3 + 1] = pos.y
      positions[i3 + 2] = pos.z
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.geometry.attributes.color.needsUpdate = true

    // Smooth, momentum-based rotation that continues
    particlesRef.current.rotation.z = time * 0.02 + scrollData.velocity * Math.PI * 2
    particlesRef.current.rotation.y = time * 0.008 + scrollData.velocity * 2
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

export function BlackHole() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const outerRingRef = useRef<THREE.Mesh>(null)
  const accretionRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (meshRef.current) {
      // Pulsing black hole
      const scale = 1 + Math.sin(time * 1.5) * 0.08
      meshRef.current.scale.set(scale, scale, scale)

      // Rotation
      meshRef.current.rotation.z = time * 0.3
      meshRef.current.rotation.x = Math.sin(time * 0.4) * 0.2
    }

    if (glowRef.current) {
      // Event horizon glow pulsing
      const glowScale = 1.3 + Math.sin(time * 1.2) * 0.25
      glowRef.current.scale.set(glowScale, glowScale, glowScale)
      glowRef.current.rotation.z = -time * 0.2
    }

    if (ringRef.current) {
      // Accretion disk
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.25) * 0.3
      ringRef.current.rotation.z = time * 0.8 + Math.sin(time * 0.3) * 0.2
    }

    if (outerRingRef.current) {
      // Outer gravitational lensing effect
      outerRingRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.2) * 0.2
      outerRingRef.current.rotation.z = time * 0.4
    }

    if (accretionRef.current) {
      // Swirling accretion disk
      accretionRef.current.rotation.z = time * 1.2
      accretionRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.15) * 0.4
    }
  })

  return (
    <group>
      {/* Core black hole - event horizon */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.98} />
      </mesh>

      {/* Event horizon photon sphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Primary accretion disk */}
      <mesh ref={accretionRef} rotation={[0, 0, 0]}>
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
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[6.5, 10, 64]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Gravitational lensing ring */}
      <mesh ref={outerRingRef} rotation={[0, 0, 0]} position={[0, 0, -0.3]}>
        <ringGeometry args={[10, 16, 64]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Distant cosmic influence */}
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

export function CosmicRings() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.4
    groupRef.current.rotation.y = time * 0.06
    groupRef.current.rotation.z = time * 0.03
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

export function NebulaClouds() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((cloud, i) => {
      cloud.rotation.z = time * 0.1 + i * 0.2
      cloud.rotation.x = Math.sin(time * 0.05 + i * 0.1) * 0.3
    })
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
