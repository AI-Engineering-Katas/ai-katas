'use client';

import { useEffect, useState, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import type { ExcalidrawElement, NonDeletedExcalidrawElement, NonDeleted } from '@excalidraw/excalidraw/types/element/types';
import type { AppState, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw';
import { exportToBlob } from '@excalidraw/utils';
import { getCommonBounds, convertToExcalidrawElements } from '@excalidraw/excalidraw';

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
  onLoad?: (api: DrawingAreaRef | null) => void;
}

export interface DrawingAreaRef {
  exportImage: () => Promise<string>;
  addMermaidDiagram: (mermaidString: string) => Promise<void>;
}

const DrawingArea = forwardRef<HTMLDivElement, DrawingAreaProps>(({ onChange, onLoad }, ref) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  
  const handleSetExcalidrawAPI = (api: ExcalidrawImperativeAPI | null) => {
    console.log('[DrawingArea] handleSetExcalidrawAPI called with:', api ? 'API object' : 'null');
    setExcalidrawAPI(api);
  };

  // Effect to call onLoad when excalidrawAPI is ready
  useEffect(() => {
    if (excalidrawAPI) {
      console.log('[DrawingArea useEffect] Excalidraw API is ready. Creating and calling onLoad with API object.');
      // Create the API object directly here
      const drawingAreaApi: DrawingAreaRef = {
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
            
            // Destructure appState and omit potentially problematic properties for export
            const { contextMenu, activeEmbeddable, ...restAppState } = appState;

            // Create a modified appState that focuses on the current viewport
            const exportAppState = {
              ...restAppState, // Use the rest of appState
              // Force the view to be centered on the current viewport
              scrollX: 0,
              scrollY: 0,
              // Apply the current zoom
              zoom: { value: 1 },
              // Other export settings
              exportScale: 2, // Higher quality
              exportWithDarkMode: false,
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
              elements: adjustedElements as any,
              appState: exportAppState as any,
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
          
            return await new Promise<string>((resolve) => {
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
              reader.onerror = () => resolve('');
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error during viewport image export:', error);
            return '';
          }
        },
        async addMermaidDiagram(mermaidString: string) {
          console.log('[DrawingArea] Received Mermaid string:', mermaidString);
          if (!excalidrawAPI) {
            console.warn('[DrawingArea] No excalidrawAPI available.');
            return;
          }
          if (!mermaidString || typeof mermaidString !== 'string' || mermaidString.trim().length === 0) {
            console.warn('[DrawingArea] Received empty or invalid Mermaid string.');
            return;
          }

          try {
            console.log('[DrawingArea] 1. Parsing Mermaid to Skeleton Elements...');
            const { elements: skeletonElements } = await parseMermaidToExcalidraw(mermaidString);
            if (!skeletonElements || skeletonElements.length === 0) {
              console.warn('[DrawingArea] Mermaid parsing resulted in no skeleton elements.');
              return;
            }
            console.log(`[DrawingArea] Parsed ${skeletonElements.length} skeleton elements.`);
            // console.log('[DrawingArea] Skeleton Elements:', skeletonElements);

            console.log('[DrawingArea] 2. Converting Skeleton to Full Excalidraw Elements...');
            const newElements = convertToExcalidrawElements(skeletonElements);
            console.log(`[DrawingArea] Converted to ${newElements.length} full Excalidraw elements.`);
            // console.log('[DrawingArea] Full Elements:', newElements);

            if (newElements.length === 0) {
              console.warn('[DrawingArea] Conversion to Excalidraw elements resulted in no elements.');
              return;
            }

            console.log('[DrawingArea] 3. Calculating positioning...');
            const appState = excalidrawAPI.getAppState();
            const currentElements = excalidrawAPI.getSceneElements();

            const viewportCenterX = appState.width / 2 / appState.zoom.value - appState.scrollX / appState.zoom.value;
            const viewportCenterY = appState.height / 2 / appState.zoom.value - appState.scrollY / appState.zoom.value;

            const nonDeletedNewElements = newElements.filter(
              (el: ExcalidrawElement): el is NonDeletedExcalidrawElement => !el.isDeleted
            );

            if (nonDeletedNewElements.length === 0) {
                console.warn("[DrawingArea] No non-deleted elements to add after conversion.");
                return;
            }

            // Get bounds using 'as any' to bypass strict type checks (Attempt 3)
            const [minX, minY, maxX, maxY] = getCommonBounds(nonDeletedNewElements as any);
            const newElementsWidth = maxX - minX;
            const newElementsHeight = maxY - minY;
            const newElementsCenterX = minX + newElementsWidth / 2;
            const newElementsCenterY = minY + newElementsHeight / 2;

            const offsetX = viewportCenterX - newElementsCenterX;
            const offsetY = viewportCenterY - newElementsCenterY;

            console.log('[DrawingArea] Calculated positioning:', { viewportCenterX, viewportCenterY, newElementsCenterX, newElementsCenterY, offsetX, offsetY });

            console.log('[DrawingArea] 4. Adjusting element positions...');
            // Adjust positions on the original non-deleted new elements
            const positionedElements = nonDeletedNewElements.map((element) => ({
              ...element,
              x: (element.x ?? 0) + offsetX,
              y: (element.y ?? 0) + offsetY,
            }));
            // console.log('[DrawingArea] Positioned Elements:', positionedElements);

            console.log('[DrawingArea] 5. Adding elements to scene...');
            excalidrawAPI.updateScene({
              // Add positioned elements using 'as any' to bypass strict type checks
              elements: [...currentElements, ...(positionedElements as any)]
            });
            console.log('[DrawingArea] Successfully added Mermaid diagram elements to the scene.');

          } catch (error) {
            console.error('[DrawingArea] Error processing or adding Mermaid diagram:', error);
          }
        }
      };
      onLoad?.(drawingAreaApi); // Call onLoad with the newly created API object
    }

    // Simplified cleanup function
    return () => {
       console.log('[DrawingArea useEffect cleanup] Calling onLoad(null).')
       onLoad?.(null); // Always notify parent that API is gone on cleanup/unmount
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI]); // Only depend on excalidrawAPI state

  try {
    console.log('Attempting to render Excalidraw');
    return (
      <div ref={ref} style={{ width: '100%', height: '100%', minHeight: '100%', position: 'relative' }}>
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