const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const api = {
  // Authentication
  async requestMagicLink(email: string, deviceId: string, identityKey: string) {
    const response = await fetch(`${API_URL}/auth/request-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, deviceId, identityKey })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to request magic link');
    }
    
    return response.json();
  },

  async verifyMagicLink(token: string) {
    const response = await fetch(`${API_URL}/auth/verify-magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to verify magic link');
    }
    
    return response.json();
  },

  // Device management
  async getDevices(identityKey: string) {
    const response = await fetch(`${API_URL}/devices/${identityKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch devices');
    }
    
    return response.json();
  }
};
