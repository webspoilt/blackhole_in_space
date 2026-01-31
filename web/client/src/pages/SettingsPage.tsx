import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Upload, Trash2, Clock } from 'lucide-react';
import { dbUtils, db } from '../lib/database';
import { encryptWithPassword, decryptWithPassword } from '../lib/crypto';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    notifications: true,
    defaultExpiry: null as number | null,
    soundEnabled: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const saved = await db.settings.get('default');
      if (saved) {
        setSettings({
          theme: saved.theme,
          notifications: saved.notifications,
          defaultExpiry: saved.defaultExpiry,
          soundEnabled: saved.soundEnabled
        });
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db.settings.put({
        id: 'default',
        ...settings
      });
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const password = prompt('Enter a password to encrypt your backup:');
      if (!password) return;

      const backup = await dbUtils.exportBackup();
      const { encrypted, salt } = encryptWithPassword(backup, password);

      const blob = new Blob([JSON.stringify({ encrypted, salt })], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vault-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert('Backup exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export backup');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const { encrypted, salt } = JSON.parse(text);

      const password = prompt('Enter your backup password:');
      if (!password) return;

      const decrypted = decryptWithPassword(encrypted, salt, password);
      if (!decrypted) {
        alert('Invalid password');
        return;
      }

      const success = await dbUtils.importBackup(decrypted);
      if (success) {
        alert('Backup imported successfully. Please refresh the page.');
      } else {
        alert('Failed to import backup');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import backup');
    }
  };

  const handleClearData = async () => {
    const confirm = window.confirm(
      'Are you sure you want to clear all data? This action cannot be undone.'
    );
    if (!confirm) return;

    const confirmAgain = window.confirm(
      'This will delete all messages, contacts, and conversations. Are you absolutely sure?'
    );
    if (!confirmAgain) return;

    try {
      await dbUtils.clearAllData();
      alert('All data cleared successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Failed to clear data:', error);
      alert('Failed to clear data');
    }
  };

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
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">
            Customize your VAULT experience
          </p>
        </div>

        {/* General Settings */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">General</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Receive notifications for new messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Sound</h3>
                <p className="text-sm text-gray-600">Play sound for notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label className="block mb-2">
                <span className="font-medium text-gray-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Default Message Expiry</span>
                </span>
                <p className="text-sm text-gray-600 mt-1">Messages will auto-delete after this time</p>
              </label>
              <select
                value={settings.defaultExpiry || ''}
                onChange={(e) => setSettings({ ...settings, defaultExpiry: e.target.value ? parseInt(e.target.value) : null })}
                className="input"
              >
                <option value="">Never</option>
                <option value="3600000">1 hour</option>
                <option value="86400000">24 hours</option>
                <option value="604800000">7 days</option>
                <option value="2592000000">30 days</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary w-full mt-6 flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* Backup & Restore */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Backup & Restore</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="btn btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Encrypted Backup</span>
            </button>

            <label className="btn btn-secondary w-full flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            ⚠️ Backups are encrypted with a password. Store them securely.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="card border-2 border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold mb-4 text-red-700">Danger Zone</h2>
          
          <button
            onClick={handleClearData}
            className="btn w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>

          <p className="text-sm text-red-700 mt-4">
            ⚠️ This will permanently delete all messages, contacts, and settings.
          </p>
        </div>
      </div>
    </div>
  );
}
