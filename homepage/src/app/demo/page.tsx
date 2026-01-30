'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, Unlock, Eye, Shield, Send, ArrowRight, RotateCcw, RefreshCw, Check } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const [message, setMessage] = useState('')
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sampleMessages = [
    'Meeting at 3pm in the secure conference room',
    'The launch codes are: ALPHA-7-BRAVO-XI',
    'Primary target coordinates: 34.567, -118.231',
    'Execute protocol DARK MATTER immediately'
  ]

  const encryptAnimation = () => {
    setIsAnimating(true)
    setAnimationStep(0)
    setShowResult(false)

    const steps = ['Encrypting...', 'Generating keys...', 'Sealing...', 'Locked!']
    let stepIndex = 0

    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setAnimationStep(stepIndex)
        stepIndex++
      } else {
        clearInterval(interval)
        setIsAnimating(false)
        setIsEncrypted(true)
        setShowResult(true)
      }
    }, 600)

    return () => clearInterval(interval)
  }

  const resetDemo = () => {
    setIsAnimating(false)
    setAnimationStep(0)
    setShowResult(false)
    setIsEncrypted(false)
  }

  // Draw encryption visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isEncrypted) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw locked state visualization
      if (isEncrypted) {
        // Draw encrypted message
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Outer ring - event horizon
        ctx.beginPath()
        ctx.arc(centerX, centerY, 150, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)'
        ctx.lineWidth = 3
        ctx.stroke()

        // Inner ring
        ctx.beginPath()
        ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw particles
        for (let i = 0; i < 50; i++) {
          const angle = Math.random() * Math.PI * 2
          const radius = 120 + Math.random() * 50
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          const distanceToCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          )

          // Particle moves towards center
          const speed = (200 - distanceToCenter) * 0.005
          const moveAngle = Math.atan2(centerY - y, centerX - x)

          const newX = x + Math.cos(moveAngle) * speed
          const newY = y + Math.sin(moveAngle) * speed

          ctx.beginPath()
          ctx.arc(newX, newY, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(59, 130, 246, ${0.8 - distanceToCenter * 0.003})`
          ctx.fill()
        }

        frame++
        if (frame < 120) {
          requestAnimationFrame(draw)
        } else {
          requestAnimationFrame(draw)
        }
      }
    }

    draw()
  }, [isEncrypted])

  const handleEncrypt = () => {
    if (message.trim()) {
      encryptAnimation()
    }
  }

  const handleDecrypt = () => {
    setIsEncrypted(false)
    setShowResult(false)
    setAnimationStep(0)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0f1a]">
      {/* Animated Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 60%)'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-white/5 backdrop-blur-lg bg-[#0a0f1a]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            VOID
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/demo" className="text-blue-400 font-semibold">Demo</Link>
            <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="/bounty" className="text-gray-400 hover:text-white transition-colors">Bounty</Link>
            <Link href="/download" className="text-gray-400 hover:text-white transition-colors">Download</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Encryption Demo
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See how your messages are protected in real-time
            </p>
          </div>
        </section>

        {/* Demo Container */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Input Section */}
            <div className="mb-8 p-8 rounded-2xl backdrop-blur-lg" style={{
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Send className="w-6 h-6 text-blue-400" />
                Your Message
              </h2>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                style={{ minHeight: '120px' }}
                disabled={isAnimating || isEncrypted}
              />

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleEncrypt}
                  disabled={isAnimating || isEncrypted || !message.trim()}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isAnimating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      {animationStep}
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Encrypt Message
                    </>
                  )}
                </button>

                <button
                  onClick={handleDecrypt}
                  disabled={!isEncrypted || isAnimating}
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isEncrypted ? (
                    <>
                      <Unlock className="w-5 h-5" />
                      Decrypt
                    </>
                  ) : (
                    <>
                      <Eye className="w-5 h-5" />
                      View Decrypted
                    </>
                  )}
                </button>

                <button
                  onClick={resetDemo}
                  className="px-6 py-4 border border-white/10 text-white hover:bg-white/10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Sample Messages */}
            <div className="mb-8">
              <p className="text-sm text-gray-400 mb-3">Try these sample messages:</p>
              <div className="space-y-2">
                {sampleMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(msg)}
                    disabled={isAnimating || isEncrypted}
                    className="w-full text-left px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white hover:border-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Visualization Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl backdrop-blur-lg" style={{
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-amber-400" />
                Encryption Visualization
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-sm text-gray-400">
                  Status: <span className={`font-semibold ${isEncrypted ? 'text-green-400' : 'text-gray-400'}`}>
                    {isEncrypted ? 'ENCRYPTED' : 'WAITING'}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  Algorithm: <span className="text-blue-400">Signal Protocol</span>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="rounded-xl bg-[#0a0f1a]/50 border border-white/5"
                />
              </div>

              {/* Explanation */}
              {isEncrypted && showResult && (
                <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-xl animate-[fadeInUp_500ms_ease-out]">
                  <div className="flex items-start gap-4 mb-3">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Message Encrypted!</h3>
                      <p className="text-gray-300">
                        Your message has been encrypted using Signal Protocol with perfect forward secrecy.
                        Only you and the recipient can decrypt it.
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-4 text-sm text-gray-400">
                    <ArrowRight className="w-4 h-4 inline-block mr-2" />
                    Hover over encrypted messages to see them get decrypted
                  </div>
                </div>
              )}

              {!isEncrypted && (
                <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-start gap-4 mb-3">
                    <Eye className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Ready to Encrypt</h3>
                      <p className="text-gray-300">
                        Type your message above and click "Encrypt Message" to see how Signal Protocol protects your communications.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl" style={{
              background: 'linear-gradient(145deg, rgba(20, 30, 48, 0.6), rgba(36, 59, 85, 0.4))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Key Exchange</h4>
                    <p className="text-gray-400 text-sm">
                      Generate unique encryption keys for each conversation
                    </p>
                  </div>
                </div>

                <div className="items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-purple-400">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Double Ratchet</h4>
                    <p className="text-gray-400 text-sm">
                      Rotate keys with every message - perfect forward secrecy
                    </p>
                  </div>
                </div>

                <div className="items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-green-400">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Sealed Sender</h4>
                    <p className="text-gray-400 text-sm">
                      Protect sender identity and message metadata
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <Link href="/features" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                Learn More About Security
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 backdrop-blur-sm bg-[#0a0f1a]/80 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 VOID. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-500 hover:text-white transition-colors text-sm">Home</Link>
              <Link href="/features" className="text-gray-500 hover:text-white transition-colors text-sm">Features</Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
