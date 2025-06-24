
import { X } from "lucide-react";

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
      "hanging-rod": { icon: "👔", name: "Hanging Rod", color: "bg-blue-400" },
      "shelves": { icon: "📚", name: "Shelves", color: "bg-green-400" },
      "drawers": { icon: "🗃️", name: "Drawers", color: "bg-yellow-400" },
      "shoe-rack": { icon: "👟", name: "Shoe Rack", color: "bg-red-400" },
      "accessory-hooks": { icon: "👜", name: "Hooks", color: "bg-purple-400" },
    };
    return moduleInfo[type];
  };

  const moduleInfo = getModuleInfo(module.type);

  return (
    <div
      className={`absolute inset-0 ${moduleInfo.color} text-white rounded-lg shadow-md border-2 transition-all duration-200 ${
        isSelected ? "border-white shadow-lg scale-105 z-10" : "border-transparent"
      }`}
      style={{
        width: `calc(${module.size.width} * (2rem + 2px) - 2px)`, // Account for gaps on mobile
        height: `calc(${module.size.height} * (2rem + 2px) - 2px)`,
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-1 relative">
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20"
          >
            <X className="w-2.5 h-2.5 text-white" />
          </button>
        )}
        
        <span className="text-lg sm:text-xl mb-0.5">{moduleInfo.icon}</span>
        <span className="text-xs font-medium text-center leading-tight hidden sm:block">
          {moduleInfo.name}
        </span>
        <span className="text-xs opacity-75 hidden sm:block">
          {module.items.length}/{module.capacity}
        </span>
      </div>
    </div>
  );
};
