import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/auth-store';
import { useWebSocketStore } from './lib/websocket';
import { dbUtils } from './lib/database';

// Pages
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import DevicesPage from './pages/DevicesPage';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { connect, disconnect } = useWebSocketStore();

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      connect(user.token);
      
      // Clean expired messages periodically
      const interval = setInterval(() => {
        dbUtils.cleanExpiredMessages();
      }, 60000); // Every minute
      
      return () => {
        clearInterval(interval);
        disconnect();
      };
    }
  }, [isAuthenticated, user, connect, disconnect]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/chat" /> : <LoginPage />} 
      />
      <Route 
        path="/auth/verify" 
        element={<VerifyPage />} 
      />
      <Route
        path="/chat"
        element={isAuthenticated ? <ChatPage /> : <Navigate to="/" />}
      />
      <Route
        path="/settings"
        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/" />}
      />
      <Route
        path="/devices"
        element={isAuthenticated ? <DevicesPage /> : <Navigate to="/" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
