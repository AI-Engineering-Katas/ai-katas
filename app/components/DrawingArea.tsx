'use client';

import React, { useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import type { AppState } from '@excalidraw/excalidraw/types/types';

interface DrawingAreaProps {
  onChange?: (elements: readonly ExcalidrawElement[], state: AppState) => void;
}

export default function DrawingArea({ onChange }: DrawingAreaProps) {
  const [dimensions, setDimensions] = useState({ width: '100%', height: '100%' });

  return (
    <div className="h-screen" style={{ width: dimensions.width, height: dimensions.height }}>
      <Excalidraw
        onChange={(elements, state) => {
          if (onChange) {
            onChange(elements, state);
          }
        }}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveAsImage: false,
            saveToActiveFile: false,
            export: false,
            toggleTheme: false
          }
        }}
        theme="light"
      />
    </div>
  );
} 