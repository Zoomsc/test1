import React, { useState } from 'react';
import { UserData } from '../types';
import { Trash, Edit2, Save, X } from 'lucide-react';

interface AdminUserCardProps {
  user: UserData & { id: string };
  onUpdateBalance: (userId: string, apiKeyIndex: number, newBalance: number) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export default function AdminUserCard({ user, onUpdateBalance, onDeleteUser }: AdminUserCardProps) {
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (index: number, currentBalance: number) => {
    setEditingKey(index);
    setEditValue(currentBalance.toString());
  };

  const handleSave = async (index: number) => {
    const newBalance = parseInt(editValue);
    if (isNaN(newBalance) || newBalance < 0) return;

    await onUpdateBalance(user.id, index, newBalance);
    setEditingKey(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">{user.email}</h3>
          <p className="text-sm text-gray-600">
            Joined on {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Role: {user.isAdmin ? 'Administrator' : 'User'}
          </p>
        </div>
        <button
          onClick={() => onDeleteUser(user.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">API Keys</h4>
        {user.apiKeys.map((apiKey, index) => (
          <div key={apiKey.key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <code className="text-sm font-mono">{apiKey.key.substring(0, 12)}...</code>
            <div className="flex items-center space-x-2">
              {editingKey === index ? (
                <>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 px-2 py-1 text-sm border rounded"
                    min="0"
                  />
                  <button
                    onClick={() => handleSave(index)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingKey(null)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm">{apiKey.balance} tokens</span>
                  <button
                    onClick={() => handleEditStart(index, apiKey.balance)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}