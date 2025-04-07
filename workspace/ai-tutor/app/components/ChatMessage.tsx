'use client';

import React from 'react';
import type { Message as UIMessage } from 'ai/react';

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[70%] rounded-lg p-4 break-words ${ 
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}