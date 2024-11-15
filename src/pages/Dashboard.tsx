import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import ApiKeyCard from '../components/ApiKeyCard';
import TransferModal from '../components/TransferModal';
import type { ApiKey, UserData } from '../types';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const createApiKey = async () => {
    if (!currentUser || !userData) return;
    
    if (userData.apiKeys.length >= 10) {
      toast.error('Maximum number of API keys reached (10)');
      return;
    }

    const newApiKey: ApiKey = {
      key: uuidv4(),
      balance: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        apiKeys: [...userData.apiKeys, newApiKey]
      });
      
      setUserData({
        ...userData,
        apiKeys: [...userData.apiKeys, newApiKey]
      });
      
      toast.success('New API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    }
  };

  const deleteApiKey = async (keyToDelete: string) => {
    if (!currentUser || !userData) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updatedKeys = userData.apiKeys.filter(key => key.key !== keyToDelete);
      
      await updateDoc(userRef, {
        apiKeys: updatedKeys
      });
      
      setUserData({
        ...userData,
        apiKeys: updatedKeys
      });
      
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const handleTransfer = async (fromKey: string, toKey: string, amount: number) => {
    if (!currentUser || !userData) return;

    const sourceKey = userData.apiKeys.find(k => k.key === fromKey);
    if (!sourceKey || sourceKey.balance < amount) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      const updatedKeys = userData.apiKeys.map(key => {
        if (key.key === fromKey) {
          return { ...key, balance: key.balance - amount };
        }
        if (key.key === toKey) {
          return { ...key, balance: key.balance + amount };
        }
        return key;
      });

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        apiKeys: updatedKeys
      });

      setUserData({
        ...userData,
        apiKeys: updatedKeys
      });

      toast.success('Transfer completed successfully');
    } catch (error) {
      console.error('Error transferring tokens:', error);
      toast.error('Failed to transfer tokens');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Keys Dashboard</h1>
        <button
          onClick={createApiKey}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          <span>New API Key</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Your API Keys</h2>
        {userData?.apiKeys.length === 0 ? (
          <p className="text-gray-600">No API keys yet. Create one to get started.</p>
        ) : (
          <div className="space-y-4">
            {userData?.apiKeys.map((apiKey) => (
              <ApiKeyCard
                key={apiKey.key}
                apiKey={apiKey}
                onDelete={deleteApiKey}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Transfer Tokens
        </button>
      </div>

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        apiKeys={userData?.apiKeys || []}
        onTransfer={handleTransfer}
      />
    </div>
  );
}