'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function DataStream({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color1: { value: new THREE.Color('#10b981') },
    color2: { value: new THREE.Color('#3b82f6') },
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1.2, 0.05, 16, 100]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;

          void main() {
            float glow = sin(vUv.x * 20.0 - time * 2.0) * 0.5 + 0.5;
            vec3 color = mix(color1, color2, glow);
            float alpha = glow * 0.8;

            // Add flowing particles effect
            float particles = step(0.9, sin(vUv.x * 50.0 + time * 3.0));
            color += vec3(particles * 0.3);

            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
