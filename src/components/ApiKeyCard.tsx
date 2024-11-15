import React from 'react';
import { Copy, Trash } from 'lucide-react';
import { ApiKey } from '../types';
import { toast } from 'react-hot-toast';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onDelete: (key: string) => Promise<void>;
}

export default function ApiKeyCard({ apiKey, onDelete }: ApiKeyCardProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey.key);
    toast.success('API key copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono truncate max-w-[200px]">
              {apiKey.key}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-gray-100 rounded"
              title="Copy API key"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Created on {formatDate(apiKey.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Balance</p>
            <p className="font-semibold">{apiKey.balance} tokens</p>
          </div>
          <button
            onClick={() => onDelete(apiKey.key)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete API key"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}