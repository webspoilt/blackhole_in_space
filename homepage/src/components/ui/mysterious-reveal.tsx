'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MysteriousRevealProps {
  children: React.ReactNode
  secretContent: React.ReactNode
  className?: string
}

export function MysteriousReveal({ children, secretContent, className = '' }: MysteriousRevealProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setTimeout(() => setIsRevealed(true), 200) // Faster reveal
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTimeout(() => setIsRevealed(false), 100) // Faster hide
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Normal content - instant hide on hover */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isHovered ? 0.92 : 1,
          filter: isHovered ? 'blur(3px)' : 'blur(0px)',
          opacity: isHovered ? 0.6 : 1,
        }}
        transition={{
          duration: 0.2, // Much faster
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>

      {/* Secret reveal - faster, smoother */}
      <AnimatePresence mode="wait">
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3, // Faster
              ease: "easeOut"
            }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.25 }}
              className="relative z-30 p-8"
            >
              {secretContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function MysteriousCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  )
}
