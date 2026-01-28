import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Fingerprint, 
  Key, 
  Shield, 
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Check,
  Lock,
  Zap
} from 'lucide-react'
import { useCryptoStore } from '../stores/cryptoStore'

export default function Identity() {
  const { 
    fingerprint, 
    publicKey, 
    pqPublicKey, 
    isInitialized, 
    isLoading,
    generateIdentity,
    panicWipe 
  } = useCryptoStore()
  
  const [copied, setCopied] = useState<string | null>(null)
  const [showWipeConfirm, setShowWipeConfirm] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleGenerate = async () => {
    await generateIdentity()
  }

  const handlePanicWipe = () => {
    panicWipe()
    setShowWipeConfirm(false)
  }

  if (!isInitialized) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-16">
          <div className="w-24 h-24 mx-auto rounded-full bg-event-horizon/10 flex items-center justify-center mb-6 animate-pulse">
            <Fingerprint className="w-12 h-12 text-event-horizon" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Create Your Identity</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Your identity is a cryptographic key pair that enables secure, 
            anonymous messaging. No phone number or email required.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-primary text-lg px-8 py-4"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Key className="w-5 h-5 mr-2" />
                Generate Identity
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Your Identity</h1>
        <p className="text-gray-500">Manage your cryptographic keys</p>
      </div>

      {/* Identity Card */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-event-horizon/20 to-singularity/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-event-horizon to-singularity flex items-center justify-center animate-event-horizon">
              <Fingerprint className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Anonymous User</h2>
              <div className="flex items-center gap-2 text-sm text-green-500">
                <Shield className="w-4 h-4" />
                Identity Verified
              </div>
            </div>
          </div>

          {/* Fingerprint */}
          <div className="space-y-4">
            <div className="p-4 bg-black-hole-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" />
                  Fingerprint
                </label>
                <button
                  onClick={() => fingerprint && copyToClipboard(fingerprint, 'fingerprint')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'fingerprint' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <code className="text-lg font-mono text-event-horizon-glow break-all">
                {fingerprint}
              </code>
            </div>

            {/* Public Key */}
            <div className="p-4 bg-black-hole-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Public Key (Ed25519)
                </label>
                <button
                  onClick={() => publicKey && copyToClipboard(publicKey, 'publicKey')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'publicKey' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <code className="text-sm font-mono text-gray-400 break-all">
                {publicKey}
              </code>
            </div>

            {/* Post-Quantum Key */}
            <div className="p-4 bg-black-hole-900/50 rounded-lg border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Post-Quantum Key (ML-KEM-768)
                </label>
                <button
                  onClick={() => pqPublicKey && copyToClipboard(pqPublicKey, 'pqPublicKey')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'pqPublicKey' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <code className="text-sm font-mono text-purple-400 break-all">
                {pqPublicKey}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-400" />
            Backup & Recovery
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-secondary flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export Identity
            </button>
            <button className="w-full btn-secondary flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Import Identity
            </button>
          </div>
        </div>

        <div className="card border-red-500/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowWipeConfirm(true)}
              className="w-full px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Panic Wipe
            </button>
            <p className="text-xs text-gray-600">
              This will permanently delete all your keys and messages.
            </p>
          </div>
        </div>
      </div>

      {/* Panic Wipe Confirmation */}
      {showWipeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md border-red-500/30"
          >
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-xl font-bold">Panic Wipe</h2>
            </div>
            
            <p className="text-gray-400 mb-4">
              This will permanently delete all your cryptographic keys and messages. 
              This action <strong className="text-white">cannot be undone</strong>.
            </p>

            <div className="p-3 bg-red-500/10 rounded-lg mb-6">
              <p className="text-sm text-red-400">
                Your messages will be lost forever. Make sure you have backups if needed.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handlePanicWipe}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Wipe Everything
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
