import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Loader } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';
import { api } from '../lib/api';

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        const response = await api.verifyMagicLink(token);
        
        // Store auth token and user info
        setUser({
          deviceId: response.deviceId,
          identityKey: response.identityKey,
          email: response.email,
          token: response.token
        });

        setStatus('success');
        
        // Redirect to chat after 1 second
        setTimeout(() => {
          navigate('/chat');
        }, 1000);
        
      } catch (err: any) {
        setStatus('error');
        setError(err.message || 'Verification failed');
      }
    };

    verifyToken();
  }, [searchParams, setUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verifying...</h2>
            <p className="text-gray-600">Please wait while we verify your identity</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">Verified!</h2>
            <p className="text-gray-600">Redirecting to your secure inbox...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
