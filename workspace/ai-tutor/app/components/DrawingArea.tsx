'use client';

import { useEffect, useState, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import type { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useDrawingAreaAPI, DrawingAreaRef } from '../hooks/useDrawingAreaAPI';

const Excalidraw = dynamic(
  async () => {
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
  onChange?: (elements: ReadonlyArray<import('@excalidraw/excalidraw/types/element/types').ExcalidrawElement>, state: AppState) => void;
  onLoad?: (api: DrawingAreaRef | null) => void;
}

const DrawingArea = forwardRef<HTMLDivElement, DrawingAreaProps>(({ onChange, onLoad }, ref) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const drawingAreaApi = useDrawingAreaAPI(excalidrawAPI);

  const handleSetExcalidrawAPI = (api: ExcalidrawImperativeAPI | null) => {
    console.log('[DrawingArea] handleSetExcalidrawAPI called with:', api ? 'API object' : 'null');
    setExcalidrawAPI(api);
  };

  useEffect(() => {
    if (excalidrawAPI) {
      console.log('[DrawingArea useEffect] Excalidraw API is ready. Calling onLoad with API from hook.');
      onLoad?.(drawingAreaApi);
    } else {
      console.log('[DrawingArea useEffect] Excalidraw API is null. Calling onLoad(null).');
      onLoad?.(null);
    }

    return () => {
      console.log('[DrawingArea useEffect cleanup] Optional: Ensure parent knows API is potentially gone.');
      // onLoad?.(null); 
    };
  }, [excalidrawAPI, drawingAreaApi, onLoad]);

  try {
    console.log('Attempting to render Excalidraw');
    return (
      <div ref={ref} style={{ width: '100%', height: '100%', minHeight: '100%', position: 'relative' }}>
        <Excalidraw
          onChange={(elements, state) => {
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
          excalidrawAPI={handleSetExcalidrawAPI}
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
});

DrawingArea.displayName = 'DrawingArea';
export default DrawingArea;