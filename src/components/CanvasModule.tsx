
import { X, Maximize2, Move } from "lucide-react";
import { CanvasModule as CanvasModuleData, GarmentPreview } from "@/utils/canvasUtils";
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

  const getRealisticModuleStyle = () => {
    const baseColor = moduleStyle.color;
    
    switch (module.type) {
      case "hanging-rod":
        return {
          background: `linear-gradient(135deg, ${baseColor}dd 0%, ${baseColor}88 50%, ${baseColor}44 100%)`,
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.3),
            inset 0 -2px 4px rgba(0,0,0,0.2),
            0 4px 8px rgba(0,0,0,0.3),
            0 2px 4px rgba(0,0,0,0.1)
          `,
          position: 'relative' as const,
          overflow: 'hidden' as const,
        };
      case "shelves":
        return {
          background: `linear-gradient(180deg, ${baseColor}dd 0%, ${baseColor}99 50%, ${baseColor}66 100%)`,
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: `
            inset 0 1px 2px rgba(255,255,255,0.4),
            inset 0 -1px 2px rgba(0,0,0,0.1),
            0 6px 12px rgba(0,0,0,0.2),
            0 2px 4px rgba(0,0,0,0.1)
          `,
          position: 'relative' as const,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.15) 15px, rgba(255,255,255,0.15) 17px)`,
        };
      case "drawers":
        return {
          background: `linear-gradient(145deg, ${baseColor}ee 0%, ${baseColor}aa 50%, ${baseColor}77 100%)`,
          border: '2px solid rgba(255,255,255,0.25)',
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.3),
            inset 0 -2px 4px rgba(0,0,0,0.15),
            0 8px 16px rgba(0,0,0,0.25),
            0 4px 8px rgba(0,0,0,0.1)
          `,
          position: 'relative' as const,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)`,
        };
      case "shoe-rack":
        return {
          background: `radial-gradient(ellipse at center, ${baseColor}dd 0%, ${baseColor}99 60%, ${baseColor}66 100%)`,
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.2),
            inset 0 -2px 4px rgba(0,0,0,0.2),
            0 6px 12px rgba(0,0,0,0.3),
            0 2px 4px rgba(0,0,0,0.15)
          `,
          position: 'relative' as const,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 3px, transparent 3px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 3px, transparent 3px)`,
          backgroundSize: '20px 20px',
        };
      case "accessory-hooks":
        return {
          background: `conic-gradient(from 45deg, ${baseColor}dd, ${baseColor}99, ${baseColor}bb, ${baseColor}dd)`,
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.4),
            inset 0 -2px 4px rgba(0,0,0,0.1),
            0 4px 8px rgba(0,0,0,0.2),
            0 2px 4px rgba(0,0,0,0.1)
          `,
          position: 'relative' as const,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.15) 8px, rgba(255,255,255,0.15) 10px)`,
        };
      default:
        return { backgroundColor: baseColor };
    }
  };

  const getModuleDetails = () => {
    switch (module.type) {
      case "hanging-rod":
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-2">
            <div className="h-1 bg-gray-400 rounded-full shadow-inner mx-2 mt-4" />
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(Math.min(3, Math.floor(module.size.width / 30)))].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-gray-300 rounded-sm shadow-sm" />
              ))}
            </div>
          </div>
        );
      case "shelves":
        return (
          <div className="absolute inset-0 flex flex-col justify-evenly px-2">
            {[...Array(Math.min(4, Math.floor(module.size.height / 30)))].map((_, i) => (
              <div key={i} className="h-0.5 bg-black/20 rounded-sm mx-1" />
            ))}
          </div>
        );
      case "drawers":
        return (
          <div className="absolute inset-0 flex flex-col justify-evenly p-2">
            {[...Array(Math.min(3, Math.floor(module.size.height / 35)))].map((_, i) => (
              <div key={i} className="relative h-6 bg-black/10 rounded-sm mx-2 flex items-center justify-end pr-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full shadow-sm" />
              </div>
            ))}
          </div>
        );
      case "shoe-rack":
        return (
          <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
            {[...Array(Math.min(6, Math.floor((module.size.width * module.size.height) / 1000)))].map((_, i) => (
              <div key={i} className="aspect-[2/1] bg-black/10 rounded-sm shadow-sm" />
            ))}
          </div>
        );
      case "accessory-hooks":
        return (
          <div className="absolute inset-0 flex justify-evenly items-center p-2">
            {[...Array(Math.min(5, Math.floor(module.size.width / 20)))].map((_, i) => (
              <div key={i} className="w-1 h-4 bg-gray-400 rounded-full shadow-sm" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getGarmentThumbnails = () => {
    if (module.items.length === 0) return null;

    const maxVisible = Math.min(4, Math.floor(module.size.width / 20));
    const visibleItems = module.items.slice(0, maxVisible);
    const remainingCount = module.items.length - maxVisible;

    return (
      <div className="absolute bottom-1 left-1 right-1 flex justify-center items-center gap-1 z-20">
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            className="w-3 h-3 rounded-full border border-white/50 shadow-sm"
            style={{ backgroundColor: item.color }}
            title={item.name}
          />
        ))}
        {remainingCount > 0 && (
          <div className="w-3 h-3 rounded-full bg-white/30 border border-white/50 flex items-center justify-center text-[8px] font-bold text-white">
            +{remainingCount}
          </div>
        )}
      </div>
    );
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
        ...getRealisticModuleStyle(),
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Realistic Module Details */}
      {getModuleDetails()}
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full p-2 relative text-white z-10">
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

      {/* Garment Thumbnails */}
      {getGarmentThumbnails()}
    </div>
  );
};
