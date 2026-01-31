import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useChatStore } from '../lib/chat-store';
import { dbUtils } from '../lib/database';

interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const { addContact } = useChatStore();
  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contact = {
        id: crypto.randomUUID(),
        deviceId,
        identityKey: deviceId, // In production, would fetch actual identity key
        name,
        addedAt: Date.now()
      };

      await dbUtils.addContact(contact);
      addContact(contact);
      onClose();
    } catch (error) {
      console.error('Failed to add contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <UserPlus className="w-6 h-6" />
            <span>Add Contact</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device ID
            </label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              placeholder="Enter device ID or scan QR code"
              className="input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask your contact to share their device ID from Settings
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
