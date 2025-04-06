'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import dynamic from 'next/dynamic';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

// Dynamically import Excalidraw component
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
  onChange?: (elements: readonly ExcalidrawElement[], state: AppState) => void;
}

export interface DrawingAreaRef {
  exportImage: () => Promise<string>;
}

const DrawingArea = forwardRef<DrawingAreaRef, DrawingAreaProps>(({ onChange }, ref) => {
  const [mounted, setMounted] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    async exportImage() {
      console.log('Starting image export process (viewport)...');
      if (!excalidrawAPI) {
        console.warn('No excalidrawAPI available for export');
        return '';
      }
      
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();
      
      console.log('Got export data:', { 
        elementCount: elements.length,
        appStateWidth: appState.width,
        appStateHeight: appState.height,
        scrollX: appState.scrollX,
        scrollY: appState.scrollY,
        zoom: appState.zoom.value
      });

      // Check if the container has valid dimensions
      if (!appState.width || !appState.height) {
          console.warn('Cannot export image, container dimensions are invalid:', { width: appState.width, height: appState.height });
          return '';
      }

      try {
        // Import the necessary function
        const { exportToBlob } = await import('@excalidraw/utils');
        console.log('Successfully imported exportToBlob');
        
        // Calculate view bounds based on appState
        const viewportWidth = appState.width / appState.zoom.value;
        const viewportHeight = appState.height / appState.zoom.value;
        const minX = -appState.scrollX / appState.zoom.value;
        const minY = -appState.scrollY / appState.zoom.value;
        
        console.log('Calculated viewport bounds:', {
          minX,
          minY,
          width: viewportWidth,
          height: viewportHeight,
          zoom: appState.zoom.value
        });
        
        // Create a modified appState that focuses on the current viewport
        const exportAppState = {
          ...appState,
          // Force the view to be centered on the current viewport
          scrollX: 0,
          scrollY: 0,
          // Apply the current zoom
          zoom: { value: 1 },
          // Other export settings
          exportScale: 2, // Higher quality
          exportWithDarkMode: false,
          viewBackgroundColor: appState.viewBackgroundColor,
          exportBackground: true
        };
        
        // Filter elements to only include those in the viewport
        const elementsInView = elements.filter((element: ExcalidrawElement) => {
          // Simple bounding box check
          const x = element.x || 0;
          const y = element.y || 0;
          const width = element.width || 0;
          const height = element.height || 0;
          
          // Check if element overlaps with viewport
          return (
            x + width >= minX &&
            y + height >= minY &&
            x <= minX + viewportWidth &&
            y <= minY + viewportHeight
          );
        });
        
        console.log('Elements in viewport:', elementsInView.length, 'of', elements.length);
        
        // Adjust element positions to be relative to viewport
        const adjustedElements = elementsInView.map((element: ExcalidrawElement) => ({
          ...element,
          x: (element.x || 0) - minX,
          y: (element.y || 0) - minY
        }));
        
        console.log('Exporting with dimensions:', {
          width: viewportWidth,
          height: viewportHeight
        });
        
        // Export only the viewport area
        const blob = await exportToBlob({
          elements: adjustedElements,
          appState: exportAppState,
          files,
          getDimensions: () => ({
            width: viewportWidth,
            height: viewportHeight
          }),
          exportPadding: 10
        });
        
        console.log('Generated viewport blob:', { 
          type: blob.type,
          size: blob.size,
          hasContent: blob.size > 0 
        });
        
        // --- Conditional download link for debugging ---
        if (process.env.NEXT_PUBLIC_DEBUG_EXPORT_IMAGE === 'true') {
          try {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `excalidraw-export-${Date.now()}.png`;
            console.log('[DEBUG] Triggering download of exported image...');
            link.click();
            URL.revokeObjectURL(url); // Clean up the object URL
          } catch (downloadError) {
            console.error('Error creating download link for debug image:', downloadError);
          }
        }
        // --- End conditional download link ---
      
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            console.log('Converted viewport blob to base64:', { 
              length: result.length,
              startsWithData: result.startsWith('data:'),
              contentType: result.split(';')[0]
            });
            resolve(result);
          };
          reader.onerror = (error) => {
            console.error('Error reading viewport blob:', error);
            resolve('');
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error during viewport image export:', error);
        return '';
      }
    }
  }), [excalidrawAPI]);

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
          excalidrawAPI={setExcalidrawAPI}
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