import React from 'react';
import { Message } from 'ai';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: Error | null;
  isDrawingAllowed: boolean;
  setIsDrawingAllowed: (value: boolean) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  isDrawingAllowed,
  setIsDrawingAllowed,
}) => {
  return (
    <div className="w-1/3 flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages
          .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
          .map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <ChatMessage message={message} />
            </div>
          ))}
      </div>

      {error && (
        <div className="text-red-500 p-4">Error: {error.message}</div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="mb-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isDrawingAllowed}
              onChange={(e) => setIsDrawingAllowed(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
              disabled={isLoading}
            />
            <span className="text-gray-700">Allow AI to Draw</span>
          </label>
        </div>
        <form onSubmit={handleSubmit}>
          <ChatInput
            value={input}
            onChange={handleInputChange}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
