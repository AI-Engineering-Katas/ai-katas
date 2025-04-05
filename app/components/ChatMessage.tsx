'use client';

import React from 'react';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  links?: Array<{
    title: string;
    url: string;
  }>;
}

export default function ChatMessage({ text, isUser, links }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{text}</p>
        {links && links.length > 0 && (
          <div className="mt-2 border-t border-gray-200 pt-2">
            <p className="text-xs font-semibold mb-1">Related Resources:</p>
            <ul className="list-none">
              {links.map((link, index) => (
                <li key={index} className="mb-1">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-xs underline ${
                      isUser ? 'text-white hover:text-gray-200' : 'text-blue-600 hover:text-blue-800'
                    }`}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 