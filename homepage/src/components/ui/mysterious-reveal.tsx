'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MysteriousRevealProps {
  children: ReactNode
  secretContent?: ReactNode
  className?: string
}

export function MysteriousReveal({ children, secretContent, className = '' }: MysteriousRevealProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setTimeout(() => setIsRevealed(true), 300)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTimeout(() => setIsRevealed(false), 100)
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Normal content */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isHovered ? 0.95 : 1,
          filter: isHovered ? 'blur(2px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Secret reveal overlay */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-emerald-900/90 via-black/95 to-violet-900/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {secretContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle glow on hover */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? 'inset 0 0 50px rgba(16, 185, 129, 0.3), 0 0 100px rgba(16, 185, 129, 0.2)'
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export function MysteriousCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }}
    >
      {/* Cosmic particles effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-emerald-400"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -50],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {children}

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.05)',
        }}
        style={{
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      />
    </motion.div>
  )
}
