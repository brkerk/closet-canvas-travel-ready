import React from "react";
import { Rnd } from "react-rnd";
import { X, Move, RotateCcw } from "lucide-react";
import { type CanvasModule as CanvasModuleData, MODULE_STYLES, snapToModules } from "@/utils/canvasUtils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModuleIcon } from "./ModuleIcons";

interface CanvasModuleProps {
  module: CanvasModuleData;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
  allModules: CanvasModuleData[];
}

export const CanvasModule = ({
  module,
  isSelected,
  onSelect,
  onRemove,
  onUpdatePosition,
  onUpdateSize,
  allModules,
}: CanvasModuleProps) => {
  const moduleStyle = MODULE_STYLES[module.type];
  const otherModules = allModules.filter(m => m.id !== module.id);
  const isMobile = useIsMobile();

  const handleDrag = (e: any, d: { x: number; y: number }) => {
    // Don't update position during drag to prevent jumping
    // Only update on drag stop for stable mobile experience
  };

  const handleDragStop = (e: any, d: { x: number; y: number }) => {
    const snappedPosition = snapToModules(
      { x: d.x, y: d.y },
      module.size,
      otherModules,
      15 // Edge snap distance
    );
    onUpdatePosition(snappedPosition);
  };

  const handleResizeStop = (
    e: any,
    direction: any,
    ref: any,
    delta: any,
    position: { x: number; y: number }
  ) => {
    const newSize = {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height)
    };
    
    onUpdateSize(newSize);
    onUpdatePosition(position);
  };

  const renderPattern = () => {
    const patternId = `pattern-${module.id}`;
    
    switch (moduleStyle.pattern) {
      case "vertical-lines":
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
                <line x1="4" y1="0" x2="4" y2="8" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        );
      case "horizontal-lines":
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
                <line x1="0" y1="4" x2="8" y2="4" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        );
      case "grid":
        return (
          <svg className="absolute inset-0 w-full h-full opacity-8">
            <defs>
              <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6">
                <line x1="0" y1="3" x2="6" y2="3" stroke="currentColor" strokeWidth="0.3"/>
                <line x1="3" y1="0" x2="3" y2="6" stroke="currentColor" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        );
      case "dots":
        return (
          <svg className="absolute inset-0 w-full h-full opacity-15">
            <defs>
              <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6">
                <circle cx="3" cy="3" r="0.8" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        );
      case "diagonal":
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6">
                <line x1="0" y1="0" x2="6" y2="6" stroke="currentColor" strokeWidth="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Rnd
      size={{ width: module.size.width, height: module.size.height }}
      position={{ x: module.position.x, y: module.position.y }}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      dragGrid={undefined}
      resizeGrid={undefined}
      bounds="parent"
      minWidth={moduleStyle.minSize.width}
      minHeight={moduleStyle.minSize.height}
      enableUserSelectHack={false}
      dragHandleClassName={isMobile ? "drag-handle-mobile" : "drag-handle"}
      enableResizing={{
        top: false,
        right: true,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false,
      }}
      style={{
        border: isSelected ? "2px solid #3B82F6" : "1px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
        zIndex: isSelected ? 10 : 1,
        pointerEvents: 'auto',
      }}
      onClick={onSelect}
    >
      <div
        className={`relative w-full h-full text-white rounded-lg flex flex-col justify-between overflow-hidden bg-gradient-to-br ${moduleStyle.gradient} ${moduleStyle.shadow} shadow-lg`}
      >
        {/* Pattern overlay */}
        {renderPattern()}
        
        {/* Header */}
        <div className={`relative z-10 p-2 flex items-center justify-between bg-black/10 backdrop-blur-sm ${isMobile ? 'drag-handle-mobile min-h-[44px]' : 'drag-handle'}`}>
          <div className="flex items-center gap-2">
            <Move size={12} className="opacity-60" />
            <span className="text-xs font-medium capitalize">
              {module.type.replace("-", " ")}
            </span>
          </div>
          
          {isSelected && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X size={12} />
            </Button>
          )}
        </div>

        {/* Content with illustration */}
        <div className="relative z-10 p-2 flex-1 flex flex-col justify-center items-center">
          <div className="mb-2">
            <ModuleIcon type={module.type} size="md" className="opacity-80" />
          </div>
          
          <div className="text-center">
            <div className="text-xs opacity-90 mb-1 font-medium">
              {module.items.length}/{module.capacity}
            </div>
            <div className="text-xs opacity-60">
              {module.size.width}×{module.size.height}
            </div>
          </div>
        </div>

        {/* Items preview */}
        {module.items.length > 0 && (
          <div className="relative z-10 p-1 bg-black/10 backdrop-blur-sm">
            <div className="flex flex-wrap gap-1">
              {module.items.slice(0, 3).map((item, index) => (
                <div
                  key={item.id}
                  className="w-3 h-3 bg-white/30 rounded-sm flex items-center justify-center border border-white/20"
                  title={item.name}
                >
                  <span className="text-xs opacity-90 font-bold">
                    {item.type.charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
              {module.items.length > 3 && (
                <div className="w-3 h-3 bg-white/30 rounded-sm flex items-center justify-center border border-white/20">
                  <span className="text-xs opacity-90 font-bold">
                    +{module.items.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
              <RotateCcw size={8} className="text-white" />
            </div>
          </div>
        )}
      </div>
    </Rnd>
  );
};
