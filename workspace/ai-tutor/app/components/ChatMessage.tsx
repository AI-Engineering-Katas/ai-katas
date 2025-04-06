'use client';

import React from 'react';

// Assuming the Message interface is defined elsewhere (e.g., types/index.ts or app/page.tsx)
// If not defined globally, you might need to import or redefine it here.
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  mermaidDiagram?: string;
}

interface ChatMessageProps {
  message: Message; // Accept the whole message object
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Basic rendering of content. Mermaid diagrams are handled/rendered in DrawingArea.
  // The content for mermaid messages might be a placeholder like "_(Rendered Mermaid diagram above)_"
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[70%] rounded-lg p-4 break-words ${ // Added break-words
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {/* Removed Links rendering as it's not in the new Message interface */}
      </div>
    </div>
  );
} 