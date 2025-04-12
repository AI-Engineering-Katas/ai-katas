'use client';

import { useCallback, useRef, useState } from 'react';
import type { ExcalidrawImperativeAPI, AppState, NormalizedZoomValue } from '@excalidraw/excalidraw/types/types';
import type { ExcalidrawElement, NonDeletedExcalidrawElement, NonDeleted } from '@excalidraw/excalidraw/types/element/types';

// Remove static imports that cause SSR issues
// import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw';
// import { getCommonBounds, convertToExcalidrawElements } from '@excalidraw/excalidraw';
// import { exportToBlob } from '@excalidraw/utils';

export interface SceneData {
  elements: readonly NonDeleted<ExcalidrawElement>[];
  appState: Readonly<AppState>;
}

export interface DrawingAreaControlFunctions {
  exportImage: () => Promise<string>;
  addMermaidDiagram: (mermaidString: string) => Promise<void>;
  getSceneData: () => SceneData | null;
  updateSceneData: (elements: readonly ExcalidrawElement[], appState: Partial<AppState>) => void;
}

export interface UseDrawingAreaResult extends DrawingAreaControlFunctions {
  excalidrawAPI: React.MutableRefObject<ExcalidrawImperativeAPI | null>;
  drawingAreaRef: React.RefObject<DrawingAreaRef | null>;
  isDrawingAllowed: boolean;
  setIsDrawingAllowed: (value: boolean) => void;
  hasDrawingContent: boolean;
  lastAssistantDrawing: string | null;
  setLastAssistantDrawing: (value: string | null) => void;
  isProcessingDiagram: boolean;
  setIsProcessingDiagram: (value: boolean) => void;
  handleDrawingChange: (elements: readonly ExcalidrawElement[], state: AppState) => void;
  handleDrawingLoad: (api: ExcalidrawImperativeAPI) => void;
}

export interface DrawingAreaRef { 
  api: ExcalidrawImperativeAPI | null;
}

// Type for the data to be loaded potentially after init
type PendingSceneData = { 
  elements: readonly ExcalidrawElement[], 
  appState: Partial<AppState>, 
  pendingMermaidDiagram?: string | null 
} | null;

export function useDrawingAreaAPI(): UseDrawingAreaResult {
  const excalidrawAPI = useRef<ExcalidrawImperativeAPI | null>(null);
  const drawingAreaRef = useRef<DrawingAreaRef | null>(null);
  const [isDrawingAllowed, setIsDrawingAllowed] = useState(false);
  const [hasDrawingContent, setHasDrawingContent] = useState(false);
  const [lastAssistantDrawing, setLastAssistantDrawing] = useState<string | null>(null);
  const [isProcessingDiagram, setIsProcessingDiagram] = useState(false);
  // State to hold scene data if updateSceneData is called before API is ready
  const [pendingSceneData, setPendingSceneData] = useState<PendingSceneData>(null);

  const exportImage = useCallback(async (): Promise<string> => {
    if (typeof window === 'undefined' || !excalidrawAPI.current) return '';
    
    const elements = excalidrawAPI.current.getSceneElements();
    const appState = excalidrawAPI.current.getAppState();

    if (!appState.width || !appState.height) return '';

    try {
      // Use dynamic import for browser-only code
      const { exportToBlob } = await import('@excalidraw/utils');
      
      const viewportWidth = appState.width / appState.zoom.value;
      const viewportHeight = appState.height / appState.zoom.value;
      const { contextMenu, activeEmbeddable, ...restAppState } = appState;

      const exportAppState: Partial<AppState> = {
        ...restAppState,
        viewBackgroundColor: '#ffffff',
        exportWithDarkMode: false,
        exportScale: 2,
        scrollX: 0,
        scrollY: 0,
        width: viewportWidth,
        height: viewportHeight,
        zoom: { value: 1 as NormalizedZoomValue }
      };

      const blob = await exportToBlob({
        // Cast elements to any to resolve persistent type mismatch
        elements: elements as any,
        appState: exportAppState,
        files: excalidrawAPI.current.getFiles(),
        getDimensions: (width: number, height: number): { width: number; height: number } => ({ width, height }),
      });

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('[DrawingArea] Error exporting image:', error);
      return '';
    }
  }, []);

  const addMermaidDiagram = useCallback(async (mermaidString: string): Promise<void> => {
    if (typeof window === 'undefined') {
      console.error('[addMermaidDiagram] Not in browser context');
      return;
    }
    
    if (!excalidrawAPI.current) {
      console.error('[addMermaidDiagram] Excalidraw API not available');
      
      // Store the Mermaid string to render later when API is available
      setPendingSceneData(prev => {
        if (prev) {
          return {
            ...prev,
            pendingMermaidDiagram: mermaidString
          };
        } else {
          // Create a new pendingSceneData object with empty elements and appState
          return {
            elements: [],
            appState: {},
            pendingMermaidDiagram: mermaidString
          };
        }
      });
      
      console.log('[addMermaidDiagram] Stored Mermaid diagram for later rendering');
      return;
    }

    console.log('[addMermaidDiagram] Starting with Mermaid string:', mermaidString.substring(0, 100) + '...');
    
    try {
      // Use dynamic imports with proper client-side check
      console.log('[addMermaidDiagram] Importing dependencies...');
      const { parseMermaidToExcalidraw } = await import('@excalidraw/mermaid-to-excalidraw');
      const { getCommonBounds, convertToExcalidrawElements } = await import('@excalidraw/excalidraw');
      
      console.log('[addMermaidDiagram] Parsing Mermaid to Excalidraw...');
      const { elements: skeletonElements } = await parseMermaidToExcalidraw(mermaidString);
      console.log('[addMermaidDiagram] Skeleton elements count:', skeletonElements.length);
      
      console.log('[addMermaidDiagram] Converting to Excalidraw elements...');
      const newElements = convertToExcalidrawElements(skeletonElements);
      console.log('[addMermaidDiagram] New elements count:', newElements.length);
      
      const nonDeletedNewElements = newElements.filter(
        (el): el is NonDeleted<ExcalidrawElement> => !el.isDeleted
      );
      console.log('[addMermaidDiagram] Non-deleted elements count:', nonDeletedNewElements.length);
      
      if (nonDeletedNewElements.length === 0) {
        console.error('[addMermaidDiagram] No valid elements after conversion');
        return;
      }
      
      const appState = excalidrawAPI.current.getAppState();
      const currentElements = excalidrawAPI.current.getSceneElements();
      console.log('[addMermaidDiagram] Current scene elements count:', currentElements.length);

      const viewportCenterX = appState.width / 2 / appState.zoom.value - appState.scrollX / appState.zoom.value;
      const viewportCenterY = appState.height / 2 / appState.zoom.value - appState.scrollY / appState.zoom.value;
      console.log('[addMermaidDiagram] Viewport center:', { x: viewportCenterX, y: viewportCenterY });

      const [minX, minY, maxX, maxY] = getCommonBounds(nonDeletedNewElements);
      const newElementsWidth = maxX - minX;
      const newElementsHeight = maxY - minY;
      const newElementsCenterX = minX + newElementsWidth / 2;
      const newElementsCenterY = minY + newElementsHeight / 2;
      console.log('[addMermaidDiagram] New elements bounds:', { minX, minY, maxX, maxY, width: newElementsWidth, height: newElementsHeight });

      const offsetX = viewportCenterX - newElementsCenterX;
      const offsetY = viewportCenterY - newElementsCenterY;
      console.log('[addMermaidDiagram] Offset for centering:', { offsetX, offsetY });

      const positionedElements = nonDeletedNewElements.map((element) => ({
        ...element,
        x: (element.x ?? 0) + offsetX,
        y: (element.y ?? 0) + offsetY,
      }));
      console.log('[addMermaidDiagram] Positioned elements ready, updating scene...');

      excalidrawAPI.current.updateScene({
        elements: [...currentElements, ...positionedElements],
        commitToHistory: true 
      });
      console.log('[addMermaidDiagram] Scene updated successfully!');
    } catch (error) {
      console.error('[addMermaidDiagram] Error processing or adding Mermaid diagram:', error);
    }
  }, []);

  const getSceneData = useCallback((): SceneData | null => {
    if (!excalidrawAPI.current) return null;
    return {
        elements: excalidrawAPI.current.getSceneElements(),
        appState: excalidrawAPI.current.getAppState()
    };
  }, []);

  const updateSceneData = useCallback((elements: readonly ExcalidrawElement[], appState: Partial<AppState>) => {
    if (!excalidrawAPI.current) {
      console.warn('[updateSceneData] Excalidraw API not available yet. Storing data.');
      // Store the data to be applied once the API is ready
      setPendingSceneData({ elements, appState });
      return;
    }
    // API is ready, update the scene directly
    excalidrawAPI.current.updateScene({
      elements,
      appState: appState as any,
      commitToHistory: true,
    });
  }, []);

  const handleDrawingChange = useCallback((elements: readonly ExcalidrawElement[], state: AppState) => {
    setHasDrawingContent(elements.length > 0);
  }, []);

  const handleDrawingLoad = useCallback((api: ExcalidrawImperativeAPI) => {
    excalidrawAPI.current = api;
    console.log('[handleDrawingLoad] Excalidraw API loaded.');

    // Check if there was pending scene data (e.g., from a file load)
    if (pendingSceneData && excalidrawAPI.current) {
      console.log('[handleDrawingLoad] Applying pending scene data.');
      excalidrawAPI.current.updateScene({
        elements: pendingSceneData.elements,
        appState: pendingSceneData.appState as any, // Use type assertion to bypass type check
        commitToHistory: true
      });
      // Clear the pending data
      setPendingSceneData(null);
    }

    // Check if there was a pending Mermaid diagram
    if (pendingSceneData?.pendingMermaidDiagram && excalidrawAPI.current) {
      console.log('[handleDrawingLoad] Rendering pending Mermaid diagram.');
      addMermaidDiagram(pendingSceneData.pendingMermaidDiagram);
      // Clear the pending Mermaid diagram after rendering
      setPendingSceneData(prev => prev ? {
        ...prev,
        pendingMermaidDiagram: null
      } : null);
    }
  }, [pendingSceneData, addMermaidDiagram]); // Add pendingSceneData and addMermaidDiagram as dependencies

  return {
    excalidrawAPI,
    drawingAreaRef,
    isDrawingAllowed,
    setIsDrawingAllowed,
    hasDrawingContent,
    lastAssistantDrawing,
    setLastAssistantDrawing,
    isProcessingDiagram,
    setIsProcessingDiagram,
    handleDrawingChange,
    handleDrawingLoad,
    exportImage,
    addMermaidDiagram,
    getSceneData,
    updateSceneData,
  };
}
