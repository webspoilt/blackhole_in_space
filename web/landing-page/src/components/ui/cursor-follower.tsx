'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CursorFollower() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Small, crisp cursor - faster response */}
      <motion.div
        style={{
          x: cursorPos.x,
          y: cursorPos.y,
        }}
        className="fixed top-0 left-0 w-16 h-16 -ml-8 -mt-8 rounded-full pointer-events-none z-[9999]"
        animate={{
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 40,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400/40 via-cyan-400/20 to-violet-400/40 backdrop-blur-sm" />
      </motion.div>

      {/* Compact center point */}
      <motion.div
        style={{
          x: cursorPos.x,
          y: cursorPos.y,
        }}
        className="fixed top-0 left-0 w-4 h-4 -ml-2 -mt-2 rounded-full pointer-events-none z-[9999] bg-emerald-400"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  )
}
