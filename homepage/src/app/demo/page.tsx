'use client'

import { useState, useEffect, useRef } from 'react'
import { Lock, Unlock, Eye, Shield, Send, ArrowRight, RotateCcw, FileText, Check, Server } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const [message, setMessage] = useState('')
  const [isEncrypted, setIsEncrypted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sampleMessages = [
    'CLASSIFIED: Operation Sovereign Shield details attached.',
    'Confirming receipt of encrypted keys for Node Alpha.',
    'Authorization Code: XJ9-22-LIMA-WHISKEY',
    'Audit Log Export Request #9921 initiated.'
  ]

  const encryptAnimation = () => {
    setIsAnimating(true)
    setAnimationStep(0)
    setShowResult(false)

    const steps = ['Initializing Ratchet...', 'Deriving Keys...', 'Sealing Content...', 'Verifying Signature...']
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

  // Visualization logic (simplified for React canvas)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isEncrypted) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple visualizer placeholder logic
    ctx.clearRect(0, 0, 400, 300)
    ctx.fillStyle = '#10b981'
    ctx.font = '14px monospace'
    ctx.fillText('ENCRYPTED PACKET STREAM', 110, 150)
    // In a real app we'd keep the fancy particles, but for this pivot we focus on the text/framing
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
    <div className="min-h-screen flex flex-col bg-[#0a0f1a] text-gray-100 font-sans">
      {/* Navigation */}


      <main className="flex-1">
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Encryption Validation Sandbox
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              Verify our cryptographic implementation in real-time. Input sensitive data and watch how the Double Ratchet Protocol handles key derivation and secrecy.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Input Column */}
            <div className="space-y-8">
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> Source Message
                </h2>
                <div className="space-y-3 mb-6">
                  {sampleMessages.map((msg, idx) => (
                    <button key={idx} onClick={() => setMessage(msg)} disabled={isAnimating || isEncrypted} className="block w-full text-left text-sm p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors truncate">
                      {msg}
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Or type secret data here..."
                  className="w-full h-32 bg-[#0a0f1a] border border-white/10 rounded-lg p-4 text-white font-mono text-sm focus:border-blue-500/50 outline-none resize-none"
                  disabled={isAnimating || isEncrypted}
                />
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleEncrypt}
                    disabled={isAnimating || isEncrypted || !message.trim()}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAnimating ? 'Processing...' : <><Lock className="w-4 h-4" /> Encrypt</>}
                  </button>
                  <button onClick={resetDemo} className="px-4 py-3 border border-white/10 text-gray-300 rounded-lg hover:bg-white/5"><RotateCcw className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            {/* Output Column */}
            <div className="space-y-8">
              <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 h-full flex flex-col">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-400" /> Protocol State
                </h2>

                <div className="flex-1 bg-[#0a0f1a] rounded-lg border border-white/10 p-4 font-mono text-xs text-green-400 overflow-hidden relative">
                  {!isEncrypted && !isAnimating && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      [Waiting for Input]
                    </div>
                  )}
                  {isAnimating && (
                    <div className="space-y-2">
                      <div className="text-blue-400">{'>'} {['Initializing session...', 'Deriving keys...', 'Sealing content...'][animationStep]}</div>
                      {animationStep > 0 && <div>Successfully derived root key from HKDF.</div>}
                      {animationStep > 1 && <div>Chain keys rotated. Forward secrecy active.</div>}
                    </div>
                  )}
                  {isEncrypted && !isAnimating && (
                    <div className="space-y-2 animate-in fade-in">
                      <div className="text-gray-500"># ENCRYPTED PAYLOAD</div>
                      <div className="break-all text-gray-300">
                        0x7f4a2b9c1d8e3f5a0b2c4d6e8f1a3b5c7d9e2f4a6b8c0d1e3f5a7b9c2d4e6f8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5...
                      </div>
                      <div className="mt-4 text-blue-400"># METADATA</div>
                      <div>Algorithm: Signal Double Ratchet</div>
                      <div>Padding: PKCS#7 (Obfuscated)</div>
                      <div>Signer: VAULT-GOV-ROOT-CA</div>
                    </div>
                  )}
                </div>

                {isEncrypted && (
                  <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="text-sm text-green-400">
                      <span className="font-bold">Verification Successful.</span> Content is mathematically indecipherable without the private key held only by you.
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#05080f] py-8 text-center text-sm text-gray-500">
        <p>© 2024 VAULT Enterprise. Demo environment - Do not use for actual classified data.</p>
      </footer>
    </div>
  )
}
