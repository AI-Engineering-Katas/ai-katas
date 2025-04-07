'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useChat, type Message as UIMessage } from 'ai/react'; 

import ChatInput from './components/ChatInput'; 
import ChatMessage from './components/ChatMessage'; 
// Import DrawingArea dynamically with SSR disabled
const DrawingArea = dynamic(
  () => import('./components/DrawingArea'),
  { ssr: false, loading: () => <div className="w-full h-full bg-white flex items-center justify-center">Loading drawing area...</div> }
);
import { DrawingAreaRef } from './hooks/useDrawingAreaAPI';

import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

const HomePage: React.FC = () => {
  const excalidrawAPI = useRef<any | null>(null);
  const drawingAreaRef = useRef<DrawingAreaRef | null>(null);
  const [isDrawingAllowed, setIsDrawingAllowed] = useState(false); 
  const [hasDrawingContent, setHasDrawingContent] = useState(false);
  const [lastAssistantDrawing, setLastAssistantDrawing] = useState<string | null>(null); 
  const [isProcessingDiagram, setIsProcessingDiagram] = useState(false);
  // Add ref for file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    isLoading, 
    error, 
    setMessages, 
    append, 
    setInput 
  } = useChat({
    api: '/api/chat',
    onFinish: (message: UIMessage) => {
      console.log("--- onFinish Triggered ---");
      console.log("Full message object:", JSON.stringify(message, null, 2));

      if (message.role === 'assistant' && message.toolInvocations) {
        console.log("Assistant message has tool invocations:", message.toolInvocations);
        
        const drawingInvocation = message.toolInvocations.find(
          (inv) => inv.toolName === 'generate_drawing'
        );

        if (drawingInvocation) {
          console.log("Found generate_drawing invocation:", JSON.stringify(drawingInvocation, null, 2));
          
          // Safely access the result property
          const drawingResult = drawingInvocation && 'result' in drawingInvocation 
              ? drawingInvocation.result 
              : undefined;

          console.log("Invocation result object:", JSON.stringify(drawingResult, null, 2));
          
          if (typeof drawingResult === 'string' && drawingResult.trim()) {
             const potentialMermaid = drawingResult.trim();
             if (potentialMermaid.startsWith('graph') || potentialMermaid.startsWith('flowchart') || potentialMermaid.startsWith('sequenceDiagram') || potentialMermaid.startsWith('classDiagram')) {
                console.log("[onFinish] Tool result seems to be the Mermaid diagram string directly.");
                setLastAssistantDrawing(potentialMermaid);
             } else {
                console.warn("[onFinish] Tool result was a string, but didn't look like Mermaid code:", potentialMermaid);
             }
          } else if (typeof drawingResult === 'object' && drawingResult !== null && 'error' in drawingResult) {
            const errorMsg = (drawingResult as any).error;
            console.warn("[onFinish] Drawing tool returned an error in result:", errorMsg);
            const errorId = Date.now().toString() + '-tool-error';
            setMessages(prev => [...prev, { id: errorId, role: 'assistant', content: `AI Drawing failed: ${errorMsg}` }]);
          } else {
            console.warn("[onFinish] generate_drawing invocation result was not a Mermaid string or a known error structure.");
          }
        } else {
          console.log("No generate_drawing invocation found in this message.");
        }
      } else if (message.role === 'assistant') {
        console.log("Assistant message without tool invocations received.");
      } else {
         console.log(`onFinish called for role: ${message.role}`);
      }
      console.log("--- onFinish End ---");
    },
    onError: (err) => {
      console.error("Chat error:", err);
      const errorId = Date.now().toString() + '-error';
      setMessages(prev => [...prev, { id: errorId, role: 'assistant', content: `Sorry, an error occurred: ${err.message}` }]);
    }
  });

  useEffect(() => {
    if (lastAssistantDrawing && drawingAreaRef.current) {
      console.log("%c Attempting to render Mermaid diagram: %c", "color: blue; font-weight: bold;", "color: black;", lastAssistantDrawing);
      
      // Set processing state
      setIsProcessingDiagram(true);
      
      // Use the addMermaidDiagram function from the DrawingAreaRef
      drawingAreaRef.current.addMermaidDiagram(lastAssistantDrawing)
        .then(() => {
          console.log("Successfully added Mermaid diagram to Excalidraw");
          // Clear the last assistant drawing after processing
          setLastAssistantDrawing(null);
        })
        .catch(error => {
          console.error("Error adding Mermaid diagram to Excalidraw:", error);
          // Show error message to user
          const errorId = Date.now().toString() + '-diagram-error';
          setMessages(prev => [...prev, { 
            id: errorId, 
            role: 'assistant', 
            content: `Failed to render diagram: ${error.message || 'Unknown error'}` 
          }]);
        })
        .finally(() => {
          setIsProcessingDiagram(false);
        });
    } else if (lastAssistantDrawing && !drawingAreaRef.current) {
      console.warn("Received Mermaid diagram but DrawingArea API is not available");
      setLastAssistantDrawing(null);
    }
  }, [lastAssistantDrawing, setMessages]);

  const handleDrawingChange = (elements: readonly ExcalidrawElement[], state: AppState) => {
    setHasDrawingContent(elements.length > 0);
  };

  const handleSend = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    let imageToSend: string | undefined = undefined;
    
    // Check if we have drawing content and the drawing API is available
    if (hasDrawingContent && drawingAreaRef.current) {
      // Use the exportImage method from DrawingAreaRef instead of directly accessing Excalidraw API
      drawingAreaRef.current.exportImage()
        .then(imageDataUrl => {
          if (imageDataUrl) {
            // Extract the base64 data part from the data URL
            const base64Data = imageDataUrl.split(',')[1];
            
            // Submit the form with the image data
            handleSubmit(e, {
              data: {
                imageData: base64Data,
                isDrawingAllowed,
              }
            });
          } else {
            // If no image data was returned, submit without image
            handleSubmit(e, {
              data: {
                imageData: null,
                isDrawingAllowed,
              }
            });
          }
        })
        .catch(error => {
          console.error("Error exporting image:", error);
          // Submit without image data if export fails
          handleSubmit(e, {
            data: {
              imageData: null,
              isDrawingAllowed,
            }
          });
        });
    } else {
      // No drawing content or API not available, submit without image
      handleSubmit(e, {
        data: {
          imageData: null,
          isDrawingAllowed,
        }
      });
    }
    
    // Prevent default form submission since we're handling it asynchronously
    e.preventDefault();
  }, [hasDrawingContent, isDrawingAllowed, handleSubmit, drawingAreaRef]);

  const handleDrawingLoad = useCallback((api: DrawingAreaRef | null) => {
    console.log('[HomePage] handleDrawingLoad called with:', api ? 'API object' : 'null');
    drawingAreaRef.current = api; 
  }, []);

  // --- Save Session Logic ---
  const handleSave = useCallback(() => {
    if (!drawingAreaRef.current) {
      console.error("Drawing area API not ready for saving.");
      // Maybe show a user notification
      return;
    }

    const sceneData = drawingAreaRef.current.getSceneData();
    if (!sceneData) {
        console.error("Could not retrieve scene data for saving.");
        return;
    }

    const sessionData = {
      drawing: sceneData,
      chat: messages, // Get current messages from useChat
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai-tutor-session.json'; // Filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("Session saved.");

  }, [drawingAreaRef, messages]);

  // --- Load Session Logic ---
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
          throw new Error("Failed to read file content.");
        }
        const loadedData = JSON.parse(content);

        // Basic validation
        if (!loadedData || typeof loadedData !== 'object' || !loadedData.drawing || !loadedData.chat) {
          throw new Error("Invalid session file format.");
        }
        if (!Array.isArray(loadedData.drawing.elements) || typeof loadedData.drawing.appState !== 'object') {
             throw new Error("Invalid drawing data in session file.");
        }
        if (!Array.isArray(loadedData.chat)) {
            throw new Error("Invalid chat data in session file.");
        }

        // Restore state
        if (drawingAreaRef.current) {
          // Ensure appState is not null/undefined before passing
          const loadedAppState = loadedData.drawing.appState || {};
          
          // --- Filter appState properties to restore ---
          // Only restore essential visual/canvas properties. 
          // Avoid restoring transient UI state like collaborators, active tools, etc.
          const appStateToRestore: Partial<AppState> = {
            viewBackgroundColor: loadedAppState.viewBackgroundColor,
            gridSize: loadedAppState.gridSize,
            // Add other essential state properties you want to preserve here
            // e.g., currentItemStrokeColor, currentItemRoughness, etc. if desired
            // --- Crucially, DO NOT include: collaborators, activeTool, openMenu, etc.
          };
          
          // Get current scroll/zoom to potentially keep the view centered
          const currentAppState = drawingAreaRef.current.getSceneData()?.appState;
          if (currentAppState) {
             appStateToRestore.scrollX = currentAppState.scrollX;
             appStateToRestore.scrollY = currentAppState.scrollY;
             appStateToRestore.zoom = currentAppState.zoom; 
          } else {
             // Fallback if current state isn't available
             appStateToRestore.scrollX = loadedAppState.scrollX;
             appStateToRestore.scrollY = loadedAppState.scrollY;
             appStateToRestore.zoom = loadedAppState.zoom;
          }

          drawingAreaRef.current.updateSceneData(loadedData.drawing.elements, appStateToRestore);
          console.log("Drawing state restored (filtered appState).");
        } else {
          console.error("Drawing area ref not available to restore state.");
          // Handle this case, maybe alert user
        }
        setMessages(loadedData.chat);
        console.log("Chat history restored.");

        // Reset file input value so the same file can be loaded again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

      } catch (error) {
        console.error("Error loading session:", error);
        alert(`Failed to load session: ${error instanceof Error ? error.message : 'Unknown error'}`);
        // Reset file input value on error too
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = (e) => {
        console.error("Error reading file:", e);
        alert("Error reading the selected file.");
    };
    reader.readAsText(file);
  }, [drawingAreaRef, setMessages]);

  const triggerLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">AI System Design Tutor</h1>
        {/* Add Save/Load Buttons */}
        <div className="flex space-x-2">
            <button 
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
                Save Session
            </button>
            <button 
                onClick={triggerLoad}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
                Load Session
            </button>
            {/* Hidden file input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json"
                style={{ display: 'none' }} 
            />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative bg-white border-r border-gray-200">
          {isProcessingDiagram && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="text-lg font-semibold text-blue-600">Processing diagram...</div>
            </div>
          )}
          <DrawingArea
            onLoad={handleDrawingLoad}
            onChange={handleDrawingChange}
          />
        </div>

        <div className="w-1/3 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter((msg) => msg.role === 'user' || msg.role === 'assistant') 
              .map((message, index) => (
                <div key={message.id || index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
            <form onSubmit={handleSend}>
              <ChatInput
                value={input} 
                onChange={handleInputChange as any} 
                isLoading={isLoading}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;