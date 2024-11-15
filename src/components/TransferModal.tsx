import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ApiKey } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKey[];
  onTransfer: (fromKey: string, toKey: string, amount: number) => Promise<void>;
}

export default function TransferModal({ isOpen, onClose, apiKeys, onTransfer }: TransferModalProps) {
  const [fromKey, setFromKey] = useState('');
  const [toKey, setToKey] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromKey || !toKey || !amount) return;

    try {
      setLoading(true);
      await onTransfer(fromKey, toKey, Number(amount));
      onClose();
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transfer Tokens</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From API Key</label>
            <select
              value={fromKey}
              onChange={(e) => setFromKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select API Key</option>
              {apiKeys.map((key) => (
                <option key={key.key} value={key.key}>
                  {key.key.substring(0, 8)}... ({key.balance} tokens)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To API Key</label>
            <select
              value={toKey}
              onChange={(e) => setToKey(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select API Key</option>
              {apiKeys
                .filter((key) => key.key !== fromKey)
                .map((key) => (
                  <option key={key.key} value={key.key}>
                    {key.key.substring(0, 8)}... ({key.balance} tokens)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Transfer Tokens'}
          </button>
        </form>
      </div>
    </div>
  );
}