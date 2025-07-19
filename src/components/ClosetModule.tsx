
import { X, Maximize2 } from "lucide-react";

export interface ClosetModuleData {
  id: string;
  type: "hanging-rod" | "shelves" | "drawers" | "shoe-rack" | "accessory-hooks";
  position: { x: number; y: number };
  size: { width: number; height: number };
  capacity: number;
  items: string[];
}

interface ClosetModuleProps {
  module: ClosetModuleData;
  isSelected: boolean;
  onRemove: () => void;
  gridCellSize: string;
}

export const ClosetModule = ({ module, isSelected, onRemove, gridCellSize }: ClosetModuleProps) => {
  const getModuleInfo = (type: ClosetModuleData["type"]) => {
    const moduleInfo = {
      "hanging-rod": { 
        icon: "👔", 
        name: "Hanging Rod", 
        color: "bg-gradient-to-br from-blue-400 to-blue-600",
        pattern: "bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_75%,transparent_75%)]",
        shadow: "shadow-blue-200"
      },
      "shelves": { 
        icon: "📚", 
        name: "Shelves", 
        color: "bg-gradient-to-br from-green-400 to-green-600",
        pattern: "bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]",
        shadow: "shadow-green-200"
      },
      "drawers": { 
        icon: "🗃️", 
        name: "Drawers", 
        color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
        pattern: "bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,rgba(255,255,255,0.1)_4px,rgba(255,255,255,0.1)_8px)]",
        shadow: "shadow-yellow-200"
      },
      "shoe-rack": { 
        icon: "👟", 
        name: "Shoe Rack", 
        color: "bg-gradient-to-br from-red-400 to-red-600",
        pattern: "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_2px,transparent_2px)]",
        shadow: "shadow-red-200"
      },
      "accessory-hooks": { 
        icon: "👜", 
        name: "Hooks", 
        color: "bg-gradient-to-br from-purple-400 to-purple-600",
        pattern: "bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_75%,transparent_75%)]",
        shadow: "shadow-purple-200"
      },
    };
    return moduleInfo[type];
  };

  const moduleInfo = getModuleInfo(module.type);
  const fillPercentage = Math.round((module.items.length / module.capacity) * 100);
  const isNearFull = fillPercentage > 80;

  return (
    <div
      className={`absolute inset-0 ${moduleInfo.color} ${moduleInfo.pattern} text-white rounded-xl shadow-lg ${moduleInfo.shadow} border-2 transition-all duration-300 hover:scale-105 ${
        isSelected 
          ? "border-white shadow-2xl scale-110 z-10 ring-4 ring-white/30" 
          : "border-transparent hover:border-white/50"
      }`}
      style={{
        width: `calc(${module.size.width} * (2rem + 2px) - 2px)`,
        height: `calc(${module.size.height} * (2rem + 2px) - 2px)`,
        backgroundSize: module.type === "shoe-rack" ? "8px 8px" : "16px 16px",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-1 relative">
        {/* Controls */}
        <div className={`absolute top-1 right-1 flex gap-1 transition-opacity duration-200 ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20 shadow-md"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Icon */}
        <div className="text-center mb-1">
          <span className="text-lg sm:text-xl drop-shadow-sm">{moduleInfo.icon}</span>
        </div>

        {/* Name */}
        <span className="text-xs font-semibold text-center leading-tight hidden sm:block drop-shadow-sm">
          {moduleInfo.name}
        </span>

        {/* Capacity indicator */}
        <div className="hidden sm:flex flex-col items-center mt-1">
          <span className="text-xs opacity-90 font-medium">
            {module.items.length}/{module.capacity}
          </span>
          
          {/* Capacity bar */}
          <div className="w-full bg-white/20 rounded-full h-1.5 mt-1 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isNearFull ? "bg-orange-300" : "bg-white"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>

        {/* Mobile capacity indicator */}
        <div className="sm:hidden absolute bottom-1 right-1">
          <div className={`w-2 h-2 rounded-full ${
            isNearFull ? "bg-orange-300" : fillPercentage > 0 ? "bg-white" : "bg-white/30"
          }`} />
        </div>
      </div>
    </div>
  );
};
