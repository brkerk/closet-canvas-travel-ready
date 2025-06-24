
import { useState } from "react";
import { Move, Plus, X } from "lucide-react";

export interface ClosetModuleData {
  id: string;
  type: "hanging-rod" | "shelves" | "drawers" | "shoe-rack" | "accessory-hooks";
  width: number;
  height: number;
  position: { x: number; y: number };
  items: string[];
  capacity: number;
}

interface ClosetModuleProps {
  module: ClosetModuleData;
  onUpdate: (module: ClosetModuleData) => void;
  onRemove: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const ClosetModule = ({ module, onUpdate, onRemove, isSelected, onSelect }: ClosetModuleProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const getModuleIcon = () => {
    switch (module.type) {
      case "hanging-rod":
        return "👔";
      case "shelves":
        return "📚";
      case "drawers":
        return "🗃️";
      case "shoe-rack":
        return "👟";
      case "accessory-hooks":
        return "👜";
      default:
        return "📦";
    }
  };

  const getModuleColor = () => {
    switch (module.type) {
      case "hanging-rod":
        return "from-blue-100 to-blue-200 border-blue-300";
      case "shelves":
        return "from-green-100 to-green-200 border-green-300";
      case "drawers":
        return "from-purple-100 to-purple-200 border-purple-300";
      case "shoe-rack":
        return "from-orange-100 to-orange-200 border-orange-300";
      case "accessory-hooks":
        return "from-pink-100 to-pink-200 border-pink-300";
      default:
        return "from-gray-100 to-gray-200 border-gray-300";
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", module.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(module.id)}
      className={`
        relative cursor-move rounded-xl border-2 p-3 transition-all duration-200
        bg-gradient-to-br ${getModuleColor()}
        ${isSelected ? "ring-2 ring-purple-400 shadow-lg" : "hover:shadow-md"}
        ${isDragging ? "opacity-50" : ""}
      `}
      style={{
        width: `${module.width * 100}px`,
        height: `${module.height * 60}px`,
        gridColumn: `span ${module.width}`,
        gridRow: `span ${module.height}`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getModuleIcon()}</span>
          <span className="text-xs font-medium text-gray-700 capitalize">
            {module.type.replace("-", " ")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Move className="w-3 h-3 text-gray-400" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(module.id);
            }}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mb-1">
        {module.items.length}/{module.capacity} items
      </div>
      
      <div className="flex flex-wrap gap-1">
        {module.items.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="w-4 h-4 bg-white/70 rounded border shadow-sm"
            title={item}
          />
        ))}
        {module.items.length > 3 && (
          <div className="w-4 h-4 bg-gray-200 rounded border flex items-center justify-center">
            <span className="text-xs text-gray-500">+{module.items.length - 3}</span>
          </div>
        )}
        {module.items.length < module.capacity && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Add item functionality would go here
            }}
            className="w-4 h-4 border-2 border-dashed border-gray-300 rounded hover:border-purple-400 flex items-center justify-center transition-colors"
          >
            <Plus className="w-2 h-2 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};
