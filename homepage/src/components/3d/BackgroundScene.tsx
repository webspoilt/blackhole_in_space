'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function BackgroundScene() {
  const { viewport } = useThree()
  const particlesRef = useRef<THREE.Points>(null)
  const cursorPos = useRef({ x: 0, y: 0 })
  const targetCursorPos = useRef({ x: 0, y: 0 })

  // Create massive particle field - universe scale
  const particles = useMemo(() => {
    const count = 15000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Create universe-wide distribution
      const layer = Math.random()
      let radius

      if (layer < 0.3) {
        // Inner black hole accretion disk
        radius = 3 + Math.random() * 8
      } else if (layer < 0.6) {
        // Middle cosmic cloud
        radius = 12 + Math.random() * 20
      } else {
        // Outer deep space
        radius = 35 + Math.random() * 60
      }

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi) * 0.3 // Flatten to create cosmic plane

      // Deep universe colors
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        // Deep space black
        colors[i3] = 0.02
        colors[i3 + 1] = 0.01
        colors[i3 + 2] = 0.03
      } else if (colorChoice < 0.7) {
        // Cosmic violet
        colors[i3] = 0.15
        colors[i3 + 1] = 0.05
        colors[i3 + 2] = 0.3
      } else if (colorChoice < 0.85) {
        // Stellar cyan
        colors[i3] = 0.0
        colors[i3 + 1] = 0.2
        colors[i3 + 2] = 0.4
      } else {
        // Accretion emerald
        colors[i3] = 0.0
        colors[i3 + 1] = 0.4
        colors[i3 + 2] = 0.2
      }

      sizes[i] = Math.random() * 0.04 + 0.005

      // Cosmic drift velocities
      velocities[i3] = (Math.random() - 0.5) * 0.008
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.008
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.002
    }

    return { positions, colors, sizes, velocities }
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

    // Smooth cursor following
    cursorPos.current.x += (targetCursorPos.current.x - cursorPos.current.x) * 0.03
    cursorPos.current.y += (targetCursorPos.current.y - cursorPos.current.y) * 0.03

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array

    // Supermassive black hole in center + cursor influence
    const blackHoleCenter = new THREE.Vector3(cursorPos.current.x * 8, cursorPos.current.y * 4, -12)
    const blackHoleMass = 50 // Supermassive

    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3

      // Get current position
      const pos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2])

      // Calculate distance to black hole (cursor)
      const distToHole = pos.distanceTo(blackHoleCenter)

      // Black hole gravitational pull - stronger when closer
      if (distToHole < 20) {
        const pullStrength = (blackHoleMass / (distToHole * distToHole)) * 0.005
        const dirToHole = new THREE.Vector3().subVectors(blackHoleCenter, pos).normalize()
        pos.addScaledVector(dirToHole, pullStrength)

        // Spiral motion around black hole
        const rotationAxis = new THREE.Vector3(0, 0, 1)
        const rotationAngle = 0.03 * pullStrength * 50
        pos.applyAxisAngle(rotationAxis, rotationAngle)

        // Stretch into event horizon
        const stretch = 1 + (20 - distToHole) * 0.02
        if (distToHole < 5) {
          pos.x *= 0.8
          pos.y *= 0.8
          colors[i3] *= 0.99 // Fade into black hole
          colors[i3 + 1] *= 0.99
          colors[i3 + 2] *= 0.99
        }
      }

      // Cosmic drift
      pos.x += particles.velocities[i3] * 0.15
      pos.y += particles.velocities[i3 + 1] * 0.15
      pos.z += particles.velocities[i3 + 2] * 0.05

      // Large-scale spiral motion - galaxy rotation
      const spiralAngle = time * 0.08 + i * 0.00005
      const spiralRadius = Math.sqrt(pos.x * pos.x + pos.y * pos.y)
      pos.x = Math.cos(spiralAngle) * spiralRadius
      pos.y = Math.sin(spiralAngle) * spiralRadius

      // Update position
      positions[i3] = pos.x
      positions[i3 + 1] = pos.y
      positions[i3 + 2] = pos.z

      // Dynamic color based on proximity to black hole
      const distToCenter = pos.length()
      const intensity = Math.max(0, 1 - distToCenter / 50)

      // Brighten and shift colors near black hole
      colors[i3] = Math.min(0.2, 0.02 + intensity * 0.5)
      colors[i3 + 1] = Math.min(0.5, 0.05 + intensity * 0.7)
      colors[i3 + 2] = Math.min(0.6, 0.1 + intensity * 0.8)
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.geometry.attributes.color.needsUpdate = true

    // Slow rotation of entire universe
    particlesRef.current.rotation.z = time * 0.015
    particlesRef.current.rotation.y = time * 0.008
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
