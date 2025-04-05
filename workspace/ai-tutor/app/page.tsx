'use client';

import { useState, useRef } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import DrawingArea, { DrawingAreaRef } from './components/DrawingArea';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

interface Message {
  text: string;
  isUser: boolean;
  links?: Array<{
    title: string;
    url: string;
  }>;
}

export default function Home() {
  console.log('Home component rendering');
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [drawingElements, setDrawingElements] = useState<ExcalidrawElement[]>([]);
  const [drawingState, setDrawingState] = useState<AppState | null>(null);
  const drawingRef = useRef<DrawingAreaRef>(null);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    
    // Add user message
    setMessages(prev => [...prev, { text: message, isUser: true }]);

    try {
      // Export the current drawing as an image
      console.log('Exporting drawing as image...');
      const imageData = await drawingRef.current?.exportImage();
      console.log('Got image data:', imageData ? 'yes' : 'no');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          imageData
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      
      // Add AI response
      setMessages(prev => [...prev, {
        text: data.message,
        isUser: false,
        links: data.links
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: error instanceof Error ? error.message : 'Sorry, there was an error processing your request.',
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawingChange = (
    elements: readonly ExcalidrawElement[],
    state: AppState
  ) => {
    console.log('Drawing changed:', { elementCount: elements.length });
    setDrawingElements(elements as ExcalidrawElement[]);
    setDrawingState(state);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* Whiteboard Section */}
      <div className="h-[70vh] border-b relative">
        <div className="h-full w-full">
          <DrawingArea ref={drawingRef} onChange={handleDrawingChange} />
        </div>
      </div>
      
      {/* Chat Section */}
      <div className="h-[30vh] flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg.text} isUser={msg.isUser} links={msg.links} />
          ))}
        </div>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </main>
  );
} 