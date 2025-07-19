
import { useRef, useState, useCallback } from "react";
import { CanvasModule as CanvasModuleComponent } from "./CanvasModule";
import { 
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  CANVAS_CONFIG, 
  snapToGrid, 
  isPositionValid 
} from "@/utils/canvasUtils";

interface ClosetCanvasProps {
  modules: CanvasModule[];
  selectedModule: string | null;
  onModuleSelect: (moduleId: string | null) => void;
  onModuleMove: (moduleId: string, newPosition: CanvasPosition) => void;
  onModuleResize: (moduleId: string, newSize: CanvasSize) => void;
  onModuleRemove: (moduleId: string) => void;
}

export const ClosetCanvas = ({
  modules,
  selectedModule,
  onModuleSelect,
  onModuleMove,
  onModuleResize,
  onModuleRemove,
}: ClosetCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    moduleId: string;
    startPos: CanvasPosition;
    offset: CanvasPosition;
    mode: 'move' | 'resize';
  } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Deselect when clicking on empty canvas
    if (e.target === canvasRef.current) {
      onModuleSelect(null);
    }
  }, [onModuleSelect]);

  const handleModuleDragStart = useCallback((moduleId: string, mode: 'move' | 'resize') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    onModuleSelect(moduleId);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    setDragState({
      moduleId,
      startPos,
      offset: {
        x: startPos.x - module.position.x,
        y: startPos.y - module.position.y
      },
      mode
    });
  }, [modules, onModuleSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    const module = modules.find(m => m.id === dragState.moduleId);
    if (!module) return;

    if (dragState.mode === 'move') {
      const newPosition = {
        x: snapToGrid(currentPos.x - dragState.offset.x),
        y: snapToGrid(currentPos.y - dragState.offset.y)
      };

      const otherModules = modules.filter(m => m.id !== dragState.moduleId);
      if (isPositionValid(newPosition, module.size, otherModules)) {
        onModuleMove(dragState.moduleId, newPosition);
      }
    } else if (dragState.mode === 'resize') {
      const newSize = {
        width: Math.max(60, snapToGrid(currentPos.x - module.position.x)),
        height: Math.max(60, snapToGrid(currentPos.y - module.position.y))
      };

      const otherModules = modules.filter(m => m.id !== dragState.moduleId);
      if (isPositionValid(module.position, newSize, otherModules)) {
        onModuleResize(dragState.moduleId, newSize);
      }
    }
  }, [dragState, modules, onModuleMove, onModuleResize]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  // Grid background pattern
  const gridPattern = `url("data:image/svg+xml,%3Csvg width='${CANVAS_CONFIG.gridSize}' height='${CANVAS_CONFIG.gridSize}' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='${CANVAS_CONFIG.gridSize}' height='${CANVAS_CONFIG.gridSize}' patternUnits='userSpaceOnUse'%3E%3Cpath d='M ${CANVAS_CONFIG.gridSize} 0 L 0 0 0 ${CANVAS_CONFIG.gridSize}' fill='none' stroke='%23E5E7EB' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Closet Design Canvas</h3>
        <p className="text-sm text-gray-600">
          Drag modules from the library and arrange them in your closet space
        </p>
      </div>
      
      <div
        ref={canvasRef}
        className="relative border-2 border-gray-200 rounded-lg overflow-hidden cursor-crosshair w-full max-w-full"
        style={{
          width: '100%',
          maxWidth: CANVAS_CONFIG.width,
          height: Math.min(CANVAS_CONFIG.height, window.innerHeight * 0.6),
          backgroundImage: gridPattern,
          backgroundColor: '#FAFAFA'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Canvas modules */}
        {modules.map((module) => (
          <CanvasModuleComponent
            key={module.id}
            module={module}
            isSelected={selectedModule === module.id}
            onSelect={() => onModuleSelect(module.id)}
            onRemove={() => onModuleRemove(module.id)}
            onStartDrag={handleModuleDragStart(module.id, 'move')}
            onStartResize={handleModuleDragStart(module.id, 'resize')}
          />
        ))}

        {/* Empty state */}
        {modules.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">🏠</div>
              <p className="text-lg font-medium mb-2">Your closet is empty</p>
              <p className="text-sm">Add modules from the library to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
