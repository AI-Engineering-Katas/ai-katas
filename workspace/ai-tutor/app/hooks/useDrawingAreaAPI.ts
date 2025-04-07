'use client';

import { ExcalidrawImperativeAPI, AppState } from '@excalidraw/excalidraw/types/types';
import type { ExcalidrawElement, NonDeletedExcalidrawElement, NonDeleted } from '@excalidraw/excalidraw/types/element/types';
import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw';
import { exportToBlob } from '@excalidraw/utils';
import { getCommonBounds, convertToExcalidrawElements } from '@excalidraw/excalidraw';
import { useCallback } from 'react';

export interface DrawingAreaRef {
  exportImage: () => Promise<string>;
  addMermaidDiagram: (mermaidString: string) => Promise<void>;
}

export function useDrawingAreaAPI(excalidrawAPI: ExcalidrawImperativeAPI | null): DrawingAreaRef {

  const exportImage = useCallback(async (): Promise<string> => {
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
      console.log('Using imported exportToBlob');

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
      const exportAppState: Partial<AppState> = {
        ...restAppState, // Use the rest of appState
        // Optionally override specific properties for export if needed
        // e.g., exportBackground: false, viewBackgroundColor: '#ffffff',
        currentItemStrokeColor: appState.currentItemStrokeColor, // Ensure essential properties are included
        // Setting scroll to 0,0 and zoom to 1 might help center the export
        // scrollX: 0, 
        // scrollY: 0,
        // zoom: { value: 1 }
      };

      console.log('Exporting with appState (first level keys):', Object.keys(exportAppState));

      const blob = await exportToBlob({
        elements: elements as any, // Using 'as any' to bypass type mismatch for elements
        appState: exportAppState as any, // Using 'as any' to bypass type mismatch for appState
        files: files,
        mimeType: 'image/png',
        // Using appState dimensions directly, assuming exportToBlob respects it
        getDimensions: (width: number, height: number) => { 
          console.log(`getDimensions called with scene: ${width}x${height}. Using appState: ${appState.width}x${appState.height}`);
          return { width: appState.width, height: appState.height, scale: 1 }; 
        },
        // exportPadding: 0, // Default padding
      });

      console.log('Blob created successfully:', blob);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('FileReader finished reading blob.');
          const base64 = reader.result as string;
          console.log('Base64 string generated (first 100 chars):', base64.substring(0, 100));
          resolve(base64);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject('Error reading blob');
        };
        reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.error('Error exporting image:', error);
      return ''; // Return empty string or throw error
    }
  }, [excalidrawAPI]);

  const addMermaidDiagram = useCallback(async (mermaidString: string) => {
    if (!excalidrawAPI) {
      console.warn('[DrawingArea] addMermaidDiagram: Excalidraw API not available.');
      return;
    }
    console.log('[DrawingArea] addMermaidDiagram called with Mermaid string.');

    try {
      console.log('[DrawingArea] 1. Parsing Mermaid string...');
      const { elements: skeletonElements } = await parseMermaidToExcalidraw(mermaidString);

      if (!skeletonElements || skeletonElements.length === 0) {
        console.warn('[DrawingArea] Mermaid string parsed to empty skeleton elements.');
        return;
      }
      console.log(`[DrawingArea] Parsed ${skeletonElements.length} skeleton elements from Mermaid string.`);

      // Convert skeleton elements to full elements BEFORE filtering/positioning
      console.log('[DrawingArea] 2. Converting Skeleton to Full Excalidraw Elements...');
      const newElements = convertToExcalidrawElements(skeletonElements);
      console.log(`[DrawingArea] Converted to ${newElements.length} full Excalidraw elements.`);

      if (newElements.length === 0) {
          console.warn("[DrawingArea] Conversion resulted in no elements.");
          return;
      }

      // Filter for non-deleted elements *after* conversion
      const nonDeletedNewElements = newElements.filter(
        (el): el is NonDeletedExcalidrawElement => !el.isDeleted
      );

      if (nonDeletedNewElements.length === 0) {
          console.warn("[DrawingArea] No non-deleted elements to add after conversion.");
          return;
      }
      
      console.log('[DrawingArea] 3. Calculating positioning...');
      const appState = excalidrawAPI.getAppState();
      const currentElements = excalidrawAPI.getSceneElements();

      // Calculate the center of the current viewport
      const viewportCenterX = appState.width / 2 / appState.zoom.value - appState.scrollX / appState.zoom.value;
      const viewportCenterY = appState.height / 2 / appState.zoom.value - appState.scrollY / appState.zoom.value;

      // Calculate the bounds and center of the new elements
      // Using 'as any' to bypass strict type checks for getCommonBounds
      const [minX, minY, maxX, maxY] = getCommonBounds(nonDeletedNewElements as any);
      const newElementsWidth = maxX - minX;
      const newElementsHeight = maxY - minY;
      const newElementsCenterX = minX + newElementsWidth / 2;
      const newElementsCenterY = minY + newElementsHeight / 2;

      // Calculate the offset needed to center the new elements in the viewport
      const offsetX = viewportCenterX - newElementsCenterX;
      const offsetY = viewportCenterY - newElementsCenterY;

      console.log('[DrawingArea] Calculated positioning:', { viewportCenterX, viewportCenterY, newElementsCenterX, newElementsCenterY, offsetX, offsetY });

      console.log('[DrawingArea] 4. Adjusting element positions...');
      // Adjust positions of the non-deleted new elements
      const positionedElements = nonDeletedNewElements.map((element) => ({
        ...element,
        x: (element.x ?? 0) + offsetX,
        y: (element.y ?? 0) + offsetY,
      }));
      // console.log('[DrawingArea] Positioned Elements:', positionedElements);

      console.log('[DrawingArea] 5. Adding elements to scene...');
      excalidrawAPI.updateScene({
        elements: [...currentElements, ...positionedElements],
        // Ensure commitToHistory is true if you want this operation to be undoable
        commitToHistory: true 
      });
      console.log('[DrawingArea] Successfully added Mermaid diagram elements to the scene.');

    } catch (error) {
      console.error('[DrawingArea] Error processing or adding Mermaid diagram:', error);
    }
  }, [excalidrawAPI]);

  return { exportImage, addMermaidDiagram };
}
