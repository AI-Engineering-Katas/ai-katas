'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import type { DrawingAreaRef } from './components/DrawingArea';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

const DrawingArea = dynamic(
  () => import('./components/DrawingArea').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading Drawing Area...</p>
  }
);

// Define the consistent Message interface
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;         // Optional: For user messages with images
  mermaidDiagram?: string; // Optional: For assistant messages containing a diagram
}

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [drawingApi, setDrawingApi] = useState<DrawingAreaRef | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // State for pending diagram data
  const [pendingMermaid, setPendingMermaid] = useState<string | null>(null);

  const sendMessage = useCallback(async (messageContent: string, imageData?: string, generateMermaid?: boolean) => {
    if (isLoading) return;
    setIsLoading(true);

    const currentUserMessage: Message = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content: messageContent,
      image: imageData,
    };

    setMessages(prev => [...prev, currentUserMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent, imageData, generateMermaid }),
      });

      console.log('[Frontend] Received response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Frontend] API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch response');
      }

      const data = await response.json();
      console.log('[Frontend] Received data:', data);

      let assistantMessage: Message | null = null;

      if (data.mermaidDiagram) {
        console.log('[Frontend] Mermaid diagram data received.');
        // Set pending state instead of rendering immediately
        setPendingMermaid(data.mermaidDiagram);
        // Update placeholder message
        assistantMessage = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: '_(Processing Mermaid diagram...)_',
          mermaidDiagram: data.mermaidDiagram, // Keep for reference if needed
        };
      } else if (data.message) {
        console.log('[Frontend] Regular message received:', data.message);
        assistantMessage = {
          id: Date.now().toString() + '-assistant',
          role: 'assistant',
          content: data.message,
        };
      } else {
        console.warn('[Frontend] Received unexpected data format:', data);
        throw new Error('Unexpected response format from server');
      }

      if (assistantMessage) {
        setMessages(prev => [...prev, assistantMessage!]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
      setPendingMermaid(null); // Clear pending state on error
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]); // Remove drawingApi dependency for now, useEffect handles it

  // Effect to render pending Mermaid diagram when API is ready
  useEffect(() => {
    // Log the state check
    console.log(`[HomePage useEffect Check] drawingApi: ${drawingApi ? 'Exists' : 'null'}, pendingMermaid: ${pendingMermaid ? 'Exists' : 'null'}`);
    if (drawingApi && pendingMermaid) {
      console.log('[HomePage useEffect] Both API and pending Mermaid are ready. Rendering...');
      drawingApi.addMermaidDiagram(pendingMermaid)
        .then(() => {
          console.log('[HomePage useEffect] addMermaidDiagram call finished successfully.');
          // Optional: Find and update the assistant message content?
          // This can be complex, maybe the initial placeholder is enough.
        })
        .catch((error) => {
          console.error('[HomePage useEffect] Error calling addMermaidDiagram:', error);
          // Optional: Update message to show error?
        })
        .finally(() => {
            console.log('[HomePage useEffect] Clearing pending Mermaid state.');
            setPendingMermaid(null); // Clear the pending state regardless of success/error
        });
    }
  }, [drawingApi, pendingMermaid]);

  const handleChatInputSend = (message: string, generateMermaid: boolean) => {
    sendMessage(message, undefined, generateMermaid);
  };

  const handleDrawingLoad = useCallback((api: DrawingAreaRef | null) => {
    console.log('[HomePage] handleDrawingLoad called with:', api);
    setDrawingApi(api);
  }, []);

  const handleDrawingChange = (elements: readonly ExcalidrawElement[], state: AppState) => {
    // console.log("Drawing changed:", elements, state);
    // You can save elements/state here if needed
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header (Optional) */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-xl font-semibold text-gray-800">AI Tutor</h1>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Drawing Area */}
        <div className="flex-1 relative bg-white border-r border-gray-200">
          <DrawingArea onLoad={handleDrawingLoad} onChange={handleDrawingChange} />
        </div>

        {/* Chat Area */}
        <div className="w-1/3 flex flex-col bg-white">
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <p className="text-gray-500 italic">Assistant is thinking...</p>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <ChatInput onSendMessage={handleChatInputSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;