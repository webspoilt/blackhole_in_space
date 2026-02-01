'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Float } from '@react-three/drei'

export function SecurityGrid() {
  const gridRef = useRef<any>(null)

  useFrame((state) => {
    if (!gridRef.current) return
    const time = state.clock.getElapsedTime()
    gridRef.current.position.y = Math.sin(time * 0.3) * 0.2
  })

  return (
    <Float rotationIntensity={0.2} floatIntensity={0.5}>
      <Grid
        ref={gridRef}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#10b981"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#059669"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
      />
    </Float>
  )
}
