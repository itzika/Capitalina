import React, { useState } from 'react';
import { LogIn, LogOut, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export function LoginButton() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4 mr-2" />
        )}
        Logout
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => {
          setAuthMode('login');
          setShowModal(true);
        }}
        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </button>
      <button
        onClick={() => {
          setAuthMode('signup');
          setShowModal(true);
        }}
        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Sign Up
      </button>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} initialMode={authMode} />
    </div>
  );
}