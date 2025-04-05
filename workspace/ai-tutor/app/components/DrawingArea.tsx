'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

// Dynamically import Excalidraw component
const Excalidraw = dynamic(
  async () => {
    // Import both the component and its styles
    const { Excalidraw } = await import('@excalidraw/excalidraw');
    return Excalidraw;
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-white flex items-center justify-center">
        Loading whiteboard...
      </div>
    ),
  }
);

interface DrawingAreaProps {
  onChange?: (elements: readonly ExcalidrawElement[], state: AppState) => void;
}

export default function DrawingArea({ onChange }: DrawingAreaProps) {
  console.log('DrawingArea component rendering');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('DrawingArea useEffect running');
    setMounted(true);
    return () => {
      console.log('DrawingArea unmounting');
      setMounted(false);
    };
  }, []);

  if (!mounted) {
    console.log('DrawingArea not yet mounted');
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        Initializing whiteboard...
      </div>
    );
  }

  try {
    console.log('Attempting to render Excalidraw');
    return (
      <div style={{ width: '100%', height: '100%', minHeight: '100%', position: 'relative' }}>
        <Excalidraw
          onChange={(elements, state) => {
            console.log('Excalidraw onChange called:', { elementCount: elements.length });
            onChange?.(elements, state);
          }}
          theme="light"
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveAsImage: false,
              saveToActiveFile: false,
              export: false,
              toggleTheme: false
            }
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Excalidraw:', error);
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        Error loading whiteboard: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }
} 