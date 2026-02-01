'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorFollower() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const [isHovering, setIsHovering] = useState(false)

  const springConfig = {
    damping: 30,
    stiffness: 200,
  }

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Track hoverable elements
    const hoverableElements = document.querySelectorAll('a, button, [role="button"]')
    hoverableElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      hoverableElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Large glow cursor */}
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="fixed top-0 left-0 w-32 h-32 -ml-16 -mt-16 rounded-full pointer-events-none z-[9999]"
        animate={{
          scale: isHovering ? 0.5 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-violet-500/30 blur-3xl" />
      </motion.div>

      {/* Inner core cursor */}
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="fixed top-0 left-0 w-4 h-4 -ml-2 -mt-2 rounded-full pointer-events-none z-[9999]"
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.15,
        }}
      >
        <div className="w-full h-full rounded-full bg-emerald-400 shadow-[0_0_20px_10px_rgba(16,185,129,0.5)]" />
      </motion.div>
    </>
  )
}
