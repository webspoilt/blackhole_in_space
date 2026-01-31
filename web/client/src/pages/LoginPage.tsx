import { useState } from 'react';
import { Shield, Lock, Zap, Eye, Globe } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';
import { api } from '../lib/api';
import { generateIdentityKeyPair, generateDeviceId, generateRegistrationId, generateSignedPreKey, publicKeyToString } from '../lib/crypto';
import { dbUtils } from '../lib/database';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Generate device identity
      const deviceId = generateDeviceId();
      const identityKeyPair = generateIdentityKeyPair();
      const registrationId = generateRegistrationId();
      const signedPreKey = generateSignedPreKey(identityKeyPair, 1);

      // Store device info
      await dbUtils.initializeDevice({
        deviceId,
        identityKeyPair,
        signedPreKey,
        registrationId,
        email,
        createdAt: Date.now()
      });

      // Request magic link
      await api.requestMagicLink(
        email,
        deviceId,
        publicKeyToString(identityKeyPair.publicKey)
      );

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <div className="text-white space-y-6 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold">VAULT</h1>
              <p className="text-white/80">Secure Messaging</p>
            </div>
          </div>

          <p className="text-xl text-white/90">
            Military-grade end-to-end encryption. Messages that never leave a trace.
          </p>

          <div className="space-y-4">
            <FeatureItem 
              icon={<Lock className="w-6 h-6" />}
              title="E2E Encryption"
              description="Signal Protocol + Post-Quantum Security"
            />
            <FeatureItem 
              icon={<Zap className="w-6 h-6" />}
              title="Zero Storage"
              description="Messages relayed, never stored on servers"
            />
            <FeatureItem 
              icon={<Eye className="w-6 h-6" />}
              title="Zero Knowledge"
              description="Prove identity without revealing secrets"
            />
            <FeatureItem 
              icon={<Globe className="w-6 h-6" />}
              title="Multi-Device"
              description="One identity, multiple devices"
            />
          </div>

          <p className="text-sm text-white/60">
            🔒 What enters the VAULT, never leaves. Not even light. Not even hackers.
          </p>
        </div>

        {/* Right: Login Form */}
        <div className="card animate-slide-up">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Welcome to VAULT</h2>
              <p className="text-gray-600 mb-6">
                Enter your email to receive a secure login link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Magic Link'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  By continuing, you agree to our end-to-end encryption policy.<br />
                  Your messages are mathematically unbreakable.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900">Check Your Email</h3>
              
              <p className="text-gray-600">
                We've sent a secure login link to<br />
                <strong className="text-gray-900">{email}</strong>
              </p>
              
              <p className="text-sm text-gray-500">
                The link will expire in 15 minutes
              </p>

              <button
                onClick={() => {
                  setSent(false);
                  setEmail('');
                }}
                className="btn btn-ghost mt-4"
              >
                Use different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
      <div className="text-white/90 flex-shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}
