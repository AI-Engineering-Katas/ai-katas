'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({ value, onChange, isLoading }: ChatInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
        className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Sending...' : 
          <PaperAirplaneIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}