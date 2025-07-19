
import { X, Maximize2, Move } from "lucide-react";
import { CanvasModule as CanvasModuleData } from "@/utils/canvasUtils";
import { MODULE_STYLES } from "@/utils/canvasUtils";

interface CanvasModuleProps {
  module: CanvasModuleData;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onStartDrag: (e: React.MouseEvent) => void;
  onStartResize: (e: React.MouseEvent) => void;
}

export const CanvasModule = ({ 
  module, 
  isSelected, 
  onSelect, 
  onRemove, 
  onStartDrag,
  onStartResize 
}: CanvasModuleProps) => {
  const moduleStyle = MODULE_STYLES[module.type];
  const fillPercentage = Math.round((module.items.length / module.capacity) * 100);
  const isNearFull = fillPercentage > 80;

  const getModuleInfo = () => {
    const moduleInfo = {
      "hanging-rod": { icon: "👔", name: "Hanging Rod" },
      "shelves": { icon: "📚", name: "Shelves" },
      "drawers": { icon: "🗃️", name: "Drawers" },
      "shoe-rack": { icon: "👟", name: "Shoe Rack" },
      "accessory-hooks": { icon: "👜", name: "Hooks" },
    };
    return moduleInfo[module.type];
  };

  const moduleInfo = getModuleInfo();

  const getPatternStyle = () => {
    const baseColor = moduleStyle.color;
    switch (moduleStyle.pattern) {
      case "vertical-lines":
        return {
          backgroundColor: baseColor,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 12px)`
        };
      case "horizontal-lines":
        return {
          backgroundColor: baseColor,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)`
        };
      case "grid":
        return {
          backgroundColor: baseColor,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)`
        };
      case "dots":
        return {
          backgroundColor: baseColor,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
          backgroundSize: "12px 12px"
        };
      case "diagonal":
        return {
          backgroundColor: baseColor,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)`
        };
      default:
        return { backgroundColor: baseColor };
    }
  };

  return (
    <div
      className={`absolute cursor-pointer select-none rounded-lg shadow-lg border-2 transition-all duration-200 ${
        isSelected 
          ? "border-white shadow-2xl ring-4 ring-white/30 z-20" 
          : "border-transparent hover:border-white/50 hover:shadow-xl"
      }`}
      style={{
        left: module.position.x,
        top: module.position.y,
        width: module.size.width,
        height: module.size.height,
        ...getPatternStyle(),
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full p-2 relative text-white">
        {/* Controls */}
        <div className={`absolute top-1 right-1 flex gap-1 transition-opacity duration-200 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <button
            onMouseDown={onStartResize}
            className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
            title="Resize"
          >
            <Maximize2 className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
            title="Remove"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Drag Handle */}
        <div
          onMouseDown={onStartDrag}
          className={`absolute top-1 left-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center cursor-move hover:bg-gray-700 transition-colors shadow-md ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          title="Move"
        >
          <Move className="w-3 h-3 text-white" />
        </div>

        {/* Icon */}
        <div className="text-2xl mb-2 drop-shadow-sm">
          {moduleInfo.icon}
        </div>

        {/* Name */}
        <span className="text-sm font-semibold text-center leading-tight drop-shadow-sm mb-2">
          {moduleInfo.name}
        </span>

        {/* Capacity indicator */}
        <div className="flex flex-col items-center">
          <span className="text-xs opacity-90 font-medium mb-1">
            {module.items.length}/{module.capacity}
          </span>
          
          {/* Capacity bar */}
          <div className="w-full max-w-16 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isNearFull ? "bg-orange-300" : "bg-white"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
