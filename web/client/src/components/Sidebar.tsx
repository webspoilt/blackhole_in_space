import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Search, Settings, Shield, Users, LogOut } from 'lucide-react';
import { useChatStore } from '../lib/chat-store';
import { useAuthStore } from '../lib/auth-store';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  onNewChat: () => void;
  onAddContact: () => void;
}

export default function Sidebar({ onNewChat, onAddContact }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { conversations, activeConversationId, setActiveConversation, searchQuery, setSearchQuery } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">VAULT</h1>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    navigate('/devices');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Devices</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-200">
        <p className="text-sm text-gray-600">Signed in as</p>
        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No conversations yet</p>
            <button onClick={onNewChat} className="btn btn-primary">
              Start chatting
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                activeConversationId === conv.id ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate flex-1">
                  {conv.name || 'Unknown'}
                </h3>
                {conv.lastMessageAt && (
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDistanceToNow(conv.lastMessageAt, { addSuffix: true })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate flex-1">
                  {conv.lastMessage || 'No messages'}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button onClick={onNewChat} className="btn btn-primary w-full flex items-center justify-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
        <button onClick={onAddContact} className="btn btn-secondary w-full flex items-center justify-center space-x-2">
          <Users className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>
    </div>
  );
}
