import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CryptoState {
  // State
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  fingerprint: string | null
  publicKey: string | null
  pqPublicKey: string | null
  
  // Actions
  initialize: () => Promise<void>
  generateIdentity: () => Promise<void>
  panicWipe: () => void
  clearError: () => void
}

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      // Initial state
      isInitialized: false,
      isLoading: false,
      error: null,
      fingerprint: null,
      publicKey: null,
      pqPublicKey: null,

      // Initialize crypto core
      initialize: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // In production, this would load the WASM module
          // For now, simulate initialization
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Generate mock identity
          const mockFingerprint = Array.from({ length: 32 }, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
          ).join('')
          
          set({
            isInitialized: true,
            isLoading: false,
            fingerprint: mockFingerprint,
            publicKey: mockFingerprint,
            pqPublicKey: mockFingerprint.slice(0, 16),
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to initialize crypto',
          })
        }
      },

      // Generate new identity
      generateIdentity: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate identity generation
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const mockFingerprint = Array.from({ length: 32 }, () => 
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
          ).join('')
          
          set({
            isLoading: false,
            fingerprint: mockFingerprint,
            publicKey: mockFingerprint,
            pqPublicKey: mockFingerprint.slice(0, 16),
          })
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to generate identity',
          })
        }
      },

      // Emergency wipe all keys
      panicWipe: () => {
        set({
          isInitialized: false,
          fingerprint: null,
          publicKey: null,
          pqPublicKey: null,
        })
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'blackhole-crypto',
      partialize: (state) => ({
        fingerprint: state.fingerprint,
        publicKey: state.publicKey,
        pqPublicKey: state.pqPublicKey,
      }),
    }
  )
)
