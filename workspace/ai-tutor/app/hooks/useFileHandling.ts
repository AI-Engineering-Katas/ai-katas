import { useRef, useCallback } from 'react';
import { Message } from 'ai';
import type { AppState } from '@excalidraw/excalidraw/types/types';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { SceneData } from './useDrawingAreaAPI';

interface SessionData {
  chat: Message[];
  drawing: SceneData | null;
}

interface UseFileHandlingProps {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  getDrawingSceneData: () => SceneData | null;
  updateDrawingSceneData: (elements: readonly ExcalidrawElement[], appState: Partial<AppState>) => void;
}

export interface UseFileHandlingResult {
  fileInputRef: React.RefObject<HTMLInputElement>;
  saveSession: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerLoad: () => void;
}

export function useFileHandling({
  messages,
  setMessages,
  getDrawingSceneData,
  updateDrawingSceneData
}: UseFileHandlingProps): UseFileHandlingResult {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSession = useCallback(() => {
    const drawingData = getDrawingSceneData();
    const sessionData: SessionData = {
      chat: messages,
      drawing: drawingData,
    };
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, getDrawingSceneData]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') {
          throw new Error('Invalid file content');
        }
        const loadedData: SessionData = JSON.parse(content);
        
        // Validate loaded data structure (basic check)
        if (!loadedData || !Array.isArray(loadedData.chat)) { 
            throw new Error('Invalid session file format');
        }

        setMessages(loadedData.chat);

        // Restore drawing data using the passed updateDrawingSceneData function
        if (loadedData.drawing && loadedData.drawing.elements && loadedData.drawing.appState) {
          // Ensure elements is an array before passing
          const elements = Array.isArray(loadedData.drawing.elements) 
            ? loadedData.drawing.elements 
            : [];
          updateDrawingSceneData(elements, loadedData.drawing.appState);
        } else {
          // Clear drawing area if no drawing data in file
          updateDrawingSceneData([], {}); 
        }

      } catch (error) {
        console.error("Error loading session:", error);
        alert(`Error loading session: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        alert('Error reading file.');
    };
    reader.readAsText(file);
    // Reset file input value to allow loading the same file again
    e.target.value = ''; 
  }, [setMessages, updateDrawingSceneData]);

  const triggerLoad = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    saveSession,
    handleFileChange,
    triggerLoad,
  };
}
