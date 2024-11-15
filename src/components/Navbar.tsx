import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Key, User, Shield } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Key className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">ZOOM::SC</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}