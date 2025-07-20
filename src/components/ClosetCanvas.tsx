
import { useRef, useCallback } from "react";
import { CanvasModule as CanvasModuleComponent } from "./CanvasModule";
import {
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  CANVAS_CONFIG
} from "@/utils/canvasUtils";

interface ClosetCanvasProps {
  modules: CanvasModule[];
  selectedModule: string | null;
  onModuleSelect: (moduleId: string | null) => void;
  onModuleMove: (moduleId: string, newPosition: CanvasPosition) => void;
  onModuleResize: (moduleId: string, newSize: CanvasSize) => void;
  onModuleRemove: (moduleId: string) => void;
  showAssignmentHighlights?: boolean;
  autoAssignments?: any[];
}

export const ClosetCanvas = ({
  modules,
  selectedModule,
  onModuleSelect,
  onModuleMove,
  onModuleResize,
  onModuleRemove,
  showAssignmentHighlights = false,
  autoAssignments = [],
}: ClosetCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Deselect when clicking on empty canvas
    if (e.target === canvasRef.current) {
      onModuleSelect(null);
    }
  }, [onModuleSelect]);

  // Clean background without grid - free-form placement
  const canvasBackground = '#f5f5f5';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Closet Elevation View</h3>
        <p className="text-sm text-gray-600">
          Blueprint-style 2D closet design - snap modules together to build your layout
        </p>
      </div>
      
      <div
        ref={canvasRef}
        className="relative border-2 border-gray-300 rounded-lg overflow-hidden w-full max-w-full"
        style={{
          width: '100%',
          maxWidth: CANVAS_CONFIG.width,
          height: Math.min(CANVAS_CONFIG.height, window.innerHeight * 0.6),
          backgroundColor: canvasBackground,
          backgroundImage: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Floor and Wall Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {/* Floor line */}
          <line 
            x1="0" 
            y1={CANVAS_CONFIG.height - 20} 
            x2={CANVAS_CONFIG.width} 
            y2={CANVAS_CONFIG.height - 20}
            stroke="rgba(0,0,0,0.3)" 
            strokeWidth="2"
          />
          {/* Left wall */}
          <line 
            x1="20" 
            y1="0" 
            x2="20" 
            y2={CANVAS_CONFIG.height - 20}
            stroke="rgba(0,0,0,0.3)" 
            strokeWidth="2"
          />
          {/* Right wall */}
          <line 
            x1={CANVAS_CONFIG.width - 20} 
            y1="0" 
            x2={CANVAS_CONFIG.width - 20} 
            y2={CANVAS_CONFIG.height - 20}
            stroke="rgba(0,0,0,0.3)" 
            strokeWidth="2"
          />
          {/* Ceiling line */}
          <line 
            x1="20" 
            y1="20" 
            x2={CANVAS_CONFIG.width - 20} 
            y2="20"
            stroke="rgba(0,0,0,0.2)" 
            strokeWidth="1"
          />
        </svg>

        {/* Canvas modules */}
        {modules.map((module) => (
          <CanvasModuleComponent
            key={module.id}
            module={module}
            isSelected={selectedModule === module.id}
            onSelect={() => onModuleSelect(module.id)}
            onRemove={() => onModuleRemove(module.id)}
            onUpdatePosition={(position) => onModuleMove(module.id, position)}
            onUpdateSize={(size) => onModuleResize(module.id, size)}
            allModules={modules}
          />
        ))}

        {/* Empty state */}
        {modules.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">📐</div>
              <p className="text-lg font-medium mb-2">Start Your Closet Design</p>
              <p className="text-sm">Add modules to create your 2D closet elevation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
