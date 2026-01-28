'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense } from 'react'

interface Scene3DProps {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
  enableControls?: boolean
  backgroundColor?: string
}

export function Scene3D({
  children,
  cameraPosition = [0, 0, 5],
  enableControls = true,
  backgroundColor = '#0a0a0a',
}: Scene3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        {enableControls && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        )}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        <Environment preset="night" />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}
