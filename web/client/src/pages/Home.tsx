import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Zap, 
  Eye, 
  Fingerprint,
  ChevronRight,
  MessageSquare
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCryptoStore } from '../stores/cryptoStore'

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Your messages are encrypted with AES-256-GCM and can only be read by the intended recipient.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    icon: Shield,
    title: 'Post-Quantum Security',
    description: 'Protected against quantum computers using ML-KEM-768 lattice-based cryptography.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    icon: Eye,
    title: 'Zero-Knowledge Proofs',
    description: 'Prove your identity without revealing your private keys using zk-SNARKs.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    icon: Zap,
    title: 'Ephemeral Messages',
    description: 'Messages are automatically deleted after delivery or expiration. No persistent storage.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
  {
    icon: Fingerprint,
    title: 'Anonymous Identity',
    description: 'No phone number or email required. Your identity is a cryptographic key pair.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
  },
  {
    icon: MessageSquare,
    title: 'Group Messaging',
    description: 'Secure group chats with MLS (Messaging Layer Security) protocol.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { fingerprint, isInitialized } = useCryptoStore()

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-event-horizon to-singularity blur-3xl opacity-30" />
          <h1 className="relative text-4xl md:text-6xl font-bold">
            <span className="gradient-text">FortiComm</span>
            <br />
            <span className="text-white">Black Hole</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto"
        >
          The messaging platform that swallows all traces.
          <br />
          <span className="text-event-horizon-glow">
            What enters the event horizon, never leaves.
          </span>
        </motion.p>

        {isInitialized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/chat')}
              className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
            >
              <MessageSquare className="w-5 h-5" />
              Start Messaging
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-400">
                Identity: {fingerprint?.slice(0, 16)}...
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <button
              onClick={() => navigate('/identity')}
              className="btn-primary text-lg px-8 py-4"
            >
              Create Your Identity
            </button>
          </motion.div>
        )}
      </section>

      {/* Features Grid */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl font-bold text-center mb-8"
        >
          Security <span className="gradient-text">Features</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="card hover:scale-105 transition-transform"
            >
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Layers */}
      <section className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">
          9 Layers of <span className="gradient-text">Security</span>
        </h2>
        
        <div className="space-y-4">
          {[
            { layer: 1, name: 'Application', desc: 'CSP, SRI, HSTS headers' },
            { layer: 2, name: 'Transport', desc: 'TLS 1.3 with certificate pinning' },
            { layer: 3, name: 'Protocol', desc: 'Signal Double Ratchet + MLS' },
            { layer: 4, name: 'Post-Quantum', desc: 'ML-KEM-768 hybrid encryption' },
            { layer: 5, name: 'Zero-Knowledge', desc: 'zk-SNARK identity proofs' },
            { layer: 6, name: 'Homomorphic', desc: 'BFV encrypted computation' },
            { layer: 7, name: 'Hardware', desc: 'TPM/Secure Enclave support' },
            { layer: 8, name: 'Memory', desc: 'Encrypted RAM, anti-dump' },
            { layer: 9, name: 'Physical', desc: 'Air-gap mode, HSM support' },
          ].map((item) => (
            <div
              key={item.layer}
              className="flex items-center gap-4 p-3 bg-black-hole-900/50 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-event-horizon/20 flex items-center justify-center text-sm font-bold text-event-horizon">
                {item.layer}
              </div>
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 text-sm ml-2">— {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="card inline-block"
        >
          <h3 className="text-xl font-bold mb-2">Ready to secure your communications?</h3>
          <p className="text-gray-400 mb-4">Join the black hole. Your messages will never escape.</p>
          <button
            onClick={() => navigate(isInitialized ? '/chat' : '/identity')}
            className="btn-primary"
          >
            {isInitialized ? 'Open Messages' : 'Get Started'}
          </button>
        </motion.div>
      </section>
    </div>
  )
}
