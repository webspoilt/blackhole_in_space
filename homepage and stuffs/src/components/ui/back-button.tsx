'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function BackButton({ href = '/', label = 'Back' }: { href?: string, label?: string }) {
  return (
    <Link href={href}>
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden"
      >
        {/* Cosmic glow effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: 0.3,
          }}
          whileHover={{
            opacity: 0.6,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-violet-500/30 rounded-full blur-2xl" />
        </motion.div>

        {/* Animated background */}
        <motion.div
          className="relative backdrop-blur-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 px-8 py-4 rounded-2xl"
          whileHover={{
            borderColor: 'rgba(16, 185, 129, 0.4)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-emerald-400"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0],
                  y: [0, -30, -50],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeOut",
                }}
                style={{
                  left: `${20 + i * 12}%`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-4">
            {/* Animated icon */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </motion.div>

            <ArrowLeft className="w-6 h-6 text-white" />

            <span className="text-xl font-bold text-white tracking-wide">
              {label}
            </span>
          </div>

          {/* Subtle border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)',
            }}
            whileHover={{
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.button>
    </Link>
  )
}
