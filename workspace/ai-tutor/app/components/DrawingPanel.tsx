'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

// Import DrawingArea dynamically with SSR disabled
const DrawingArea = dynamic(
  () => import('./DrawingArea'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-white flex items-center justify-center">
        Loading drawing area...
      </div>
    ),
  }
);

interface DrawingPanelProps {
  isProcessingDiagram: boolean;
  handleDrawingLoad: (api: any) => void;
  handleDrawingChange: (
    elements: readonly ExcalidrawElement[],
    state: AppState
  ) => void;
}

const DrawingPanel: React.FC<DrawingPanelProps> = ({
  isProcessingDiagram,
  handleDrawingLoad,
  handleDrawingChange,
}) => {
  return (
    <div className="flex-1 relative bg-white border-r border-gray-200">
      {isProcessingDiagram && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="text-lg font-semibold text-blue-600">
            Processing diagram...
          </div>
        </div>
      )}
      <DrawingArea onLoad={handleDrawingLoad} onChange={handleDrawingChange} />
    </div>
  );
};

export default DrawingPanel;
