'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  onSendMessage: (message: string, generateMermaid: boolean) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [generateMermaid, setGenerateMermaid] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message, generateMermaid);
      setMessage('');
    }
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGenerateMermaid(e.target.checked);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <input
          type="checkbox"
          id="mermaid-toggle"
          checked={generateMermaid}
          onChange={handleToggleChange}
          disabled={isLoading}
          className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out disabled:opacity-50"
        />
        <label htmlFor="mermaid-toggle" className="text-sm text-gray-600 select-none">
          Generate Mermaid Diagram Suggestion
        </label>
      </div>
    </form>
  );
} 