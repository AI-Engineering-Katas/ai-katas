'use client';

import { useState, useRef } from 'react';
import { useChat } from 'ai/react';
import { useDrawingAreaAPI } from './hooks/useDrawingAreaAPI';
import { useFileHandling } from './hooks/useFileHandling';
import ChatPanel from './components/ChatPanel';
import DrawingPanel from './components/DrawingPanel';

const HomePage: React.FC = () => {
  const {
    drawingAreaRef,
    isDrawingAllowed,
    setIsDrawingAllowed,
    setLastAssistantDrawing,
    isProcessingDiagram,
    setIsProcessingDiagram,
    handleDrawingChange,
    handleDrawingLoad,
    getSceneData,
    updateSceneData,
    addMermaidDiagram,
  } = useDrawingAreaAPI();

  const {
    messages,
    input,
    handleInputChange: rawHandleInputChange,
    handleSubmit: rawHandleSubmit,
    isLoading,
    error: rawError,
    setMessages,
  } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      console.log('[onFinish] Message received:', message.role, 'Has toolInvocations:', !!message.toolInvocations);
      
      if (message.role === 'assistant' && message.toolInvocations) {
        console.log('[onFinish] Tool invocations count:', message.toolInvocations.length);
        
        const drawingInvocation = message.toolInvocations.find(
          (inv) => inv.toolName === 'generate_drawing'
        );
        
        console.log('[onFinish] Drawing invocation found:', !!drawingInvocation);

        if (drawingInvocation) {
          console.log('[onFinish] Drawing invocation details:', {
            toolName: drawingInvocation.toolName,
            hasResult: 'result' in drawingInvocation,
            resultType: 'result' in drawingInvocation ? typeof (drawingInvocation as any).result : 'undefined'
          });
          
          // Use type assertion to access the result property
          const drawingResult = drawingInvocation && 'result' in drawingInvocation 
              ? (drawingInvocation as any).result 
              : undefined;
          
          console.log('[onFinish] Drawing result type:', typeof drawingResult);
          
          if (typeof drawingResult === 'string' && drawingResult.trim()) {
             const potentialMermaid = drawingResult.trim();
             console.log('[onFinish] Potential Mermaid code (first 50 chars):', potentialMermaid.substring(0, 50) + '...');
             
             const isMermaid = potentialMermaid.startsWith('graph') || 
                               potentialMermaid.startsWith('flowchart') || 
                               potentialMermaid.startsWith('sequenceDiagram') || 
                               potentialMermaid.startsWith('classDiagram');
             
             console.log('[onFinish] Is valid Mermaid code:', isMermaid);
             
             if (isMermaid) {
                // Store the Mermaid code for reference
                setLastAssistantDrawing(potentialMermaid);
                console.log('[onFinish] Set lastAssistantDrawing with Mermaid code');
                
                // Set processing flag to show loading indicator
                setIsProcessingDiagram(true);
                console.log('[onFinish] Set isProcessingDiagram to true');
                
                // Actually render the diagram in the drawing area
                // Using setTimeout to ensure this happens after the current execution context
                console.log('[onFinish] Setting timeout to add Mermaid diagram');
                setTimeout(async () => {
                  try {
                    console.log('[onFinish:setTimeout] Adding Mermaid diagram to drawing area');
                    await addMermaidDiagram(potentialMermaid);
                    console.log('[onFinish:setTimeout] Successfully added Mermaid diagram');
                  } catch (error) {
                    console.error('[onFinish:setTimeout] Error adding Mermaid diagram:', error);
                  } finally {
                    console.log('[onFinish:setTimeout] Setting isProcessingDiagram to false');
                    setIsProcessingDiagram(false);
                  }
                }, 500); 
                console.log('[onFinish] Timeout set');
             }
          } else if (typeof drawingResult === 'object' && drawingResult !== null && 'error' in drawingResult) {
            const errorMsg = (drawingResult as any).error;
            const errorId = Date.now().toString() + '-tool-error';
            setMessages(prev => [...prev, { id: errorId, role: 'assistant', content: `AI Drawing failed: ${errorMsg}` }]);
          }
        }
      }
    },
  });

  const error = rawError || null;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    rawHandleInputChange(e as React.ChangeEvent<HTMLInputElement>);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    rawHandleSubmit(e, {
      body: {
        isDrawingAllowed,
      },
    });
  };

  const { saveSession, handleFileChange, triggerLoad, fileInputRef } = useFileHandling({
    messages,
    setMessages,
    getDrawingSceneData: getSceneData,
    updateDrawingSceneData: updateSceneData,
  });

  const handleSaveClick = () => {
    saveSession();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">AI System Design Tutor</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveClick}
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
        <DrawingPanel
          isProcessingDiagram={isProcessingDiagram}
          handleDrawingLoad={handleDrawingLoad}
          handleDrawingChange={handleDrawingChange}
        />
        <ChatPanel
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          isDrawingAllowed={isDrawingAllowed}
          setIsDrawingAllowed={setIsDrawingAllowed}
        />
      </div>
    </div>
  );
};

export default HomePage;