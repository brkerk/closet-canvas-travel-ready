
import { useRef, useState, useCallback } from "react";
import { CanvasModule as CanvasModuleComponent } from "./CanvasModule";
import { 
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  CANVAS_CONFIG, 
  snapToGrid, 
  snapToModulesAndGrid,
  isPositionValid 
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
      const newPosition = snapToModulesAndGrid(
        { x: currentPos.x - dragState.offset.x, y: currentPos.y - dragState.offset.y },
        module.size,
        modules.filter(m => m.id !== dragState.moduleId)
      );

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

  // Blueprint-style background with architectural grid
  const blueprintBackground = `
    linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)
  `;

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
          background: blueprintBackground,
          backgroundSize: '20px 20px, 20px 20px, 100% 100%',
          backgroundPosition: '0 0, 0 0, 0 0'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="2"
          />
          {/* Left wall */}
          <line 
            x1="20" 
            y1="0" 
            x2="20" 
            y2={CANVAS_CONFIG.height - 20}
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="2"
          />
          {/* Right wall */}
          <line 
            x1={CANVAS_CONFIG.width - 20} 
            y1="0" 
            x2={CANVAS_CONFIG.width - 20} 
            y2={CANVAS_CONFIG.height - 20}
            stroke="rgba(255,255,255,0.4)" 
            strokeWidth="2"
          />
          {/* Ceiling line */}
          <line 
            x1="20" 
            y1="20" 
            x2={CANVAS_CONFIG.width - 20} 
            y2="20"
            stroke="rgba(255,255,255,0.3)" 
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
            onStartDrag={handleModuleDragStart(module.id, 'move')}
            onStartResize={handleModuleDragStart(module.id, 'resize')}
          />
        ))}

        {/* Empty state */}
        {modules.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-white/70">
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
