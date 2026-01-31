import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Trash2, QrCode } from 'lucide-react';
import { useAuthStore } from '../lib/auth-store';
import { api } from '../lib/api';
import { dbUtils } from '../lib/database';

export default function DevicesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [devices, setDevices] = useState<any[]>([]);
  const [currentDevice, setCurrentDevice] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      // Load current device
      const device = await dbUtils.getCurrentDevice();
      setCurrentDevice(device);
      
      // Load all devices for this identity
      const response = await api.getDevices(user.identityKey);
      setDevices(response.devices);
    };
    
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate('/chat')}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chat</span>
        </button>

        <div className="card mb-6">
          <h1 className="text-3xl font-bold mb-2">Device Management</h1>
          <p className="text-gray-600">
            Manage all devices connected to your VAULT identity
          </p>
        </div>

        {/* Current Device */}
        {currentDevice && (
          <div className="card mb-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">This Device</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Device ID:</span>
                <span className="font-mono text-gray-900">{currentDevice.deviceId.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration ID:</span>
                <span className="font-mono text-gray-900">{currentDevice.registrationId}</span>
              </div>
            </div>

            <button
              onClick={() => setShowQR(true)}
              className="btn btn-primary w-full mt-4 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR Code</span>
            </button>
          </div>
        )}

        {/* Other Devices */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Other Devices</h2>
          
          {devices.filter(d => d.deviceId !== user?.deviceId).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No other devices connected</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices
                .filter(d => d.deviceId !== user?.deviceId)
                .map((device) => (
                  <div key={device.deviceId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Device</p>
                        <p className="text-sm text-gray-500">
                          Last seen: {new Date(device.lastSeen).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {device.isOnline && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          Online
                        </span>
                      )}
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {showQR && currentDevice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4">Device QR Code</h3>
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="w-64 h-64 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">QR Code Here</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan this code to verify your device identity
              </p>
              <button onClick={() => setShowQR(false)} className="btn btn-primary w-full">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
