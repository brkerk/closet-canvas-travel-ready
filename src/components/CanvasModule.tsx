
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

  const getBlueprintModuleStyle = () => {
    // Blueprint-style elevation rendering with architectural line work
    switch (module.type) {
      case "hanging-rod":
        return {
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '2px solid #334155',
          position: 'relative' as const,
          overflow: 'hidden' as const,
        };
      case "shelves":
        return {
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '2px solid #334155',
          position: 'relative' as const,
        };
      case "drawers":
        return {
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '2px solid #334155',
          position: 'relative' as const,
        };
      case "shoe-rack":
        return {
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '2px solid #334155',
          position: 'relative' as const,
        };
      case "accessory-hooks":
        return {
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '2px solid #334155',
          position: 'relative' as const,
        };
      default:
        return { 
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '2px solid #334155'
        };
    }
  };

  const getBlueprintModuleDetails = () => {
    // Architectural line drawings for blueprint style
    switch (module.type) {
      case "hanging-rod":
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Hanging rod */}
            <line 
              x1="8" y1="15" x2={module.size.width - 8} y2="15"
              stroke="#334155" strokeWidth="3" strokeLinecap="round"
            />
            {/* Support brackets */}
            <rect x="6" y="12" width="4" height="6" fill="none" stroke="#334155" strokeWidth="1"/>
            <rect x={module.size.width - 10} y="12" width="4" height="6" fill="none" stroke="#334155" strokeWidth="1"/>
            {/* Hanging clothes representation */}
            {module.items.slice(0, Math.floor(module.size.width / 25)).map((_, i) => (
              <line 
                key={i}
                x1={15 + i * 25} y1="15" 
                x2={15 + i * 25} y2={module.size.height - 20}
                stroke="#64748b" strokeWidth="2" strokeDasharray="2,2"
              />
            ))}
          </svg>
        );
      case "shelves":
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Shelf lines */}
            {[...Array(Math.min(4, Math.floor(module.size.height / 40)))].map((_, i) => {
              const y = 20 + i * (module.size.height - 40) / Math.max(1, Math.min(3, Math.floor(module.size.height / 40) - 1));
              return (
                <g key={i}>
                  <line 
                    x1="4" y1={y} x2={module.size.width - 4} y2={y}
                    stroke="#334155" strokeWidth="2"
                  />
                  {/* Support lines */}
                  <line x1="4" y1={y} x2="4" y2={y + 3} stroke="#334155" strokeWidth="1"/>
                  <line x1={module.size.width - 4} y1={y} x2={module.size.width - 4} y2={y + 3} stroke="#334155" strokeWidth="1"/>
                </g>
              );
            })}
          </svg>
        );
      case "drawers":
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Drawer fronts */}
            {[...Array(Math.min(3, Math.floor(module.size.height / 50)))].map((_, i) => {
              const height = (module.size.height - 16) / Math.min(3, Math.floor(module.size.height / 50));
              const y = 8 + i * height;
              return (
                <g key={i}>
                  <rect 
                    x="6" y={y} 
                    width={module.size.width - 12} height={height - 4}
                    fill="none" stroke="#334155" strokeWidth="1.5"
                  />
                  {/* Drawer handle */}
                  <circle 
                    cx={module.size.width - 15} cy={y + height/2 - 2}
                    r="2" fill="#334155"
                  />
                </g>
              );
            })}
          </svg>
        );
      case "shoe-rack":
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Shoe rack compartments */}
            {[...Array(Math.min(6, Math.floor((module.size.width * module.size.height) / 2000)))].map((_, i) => {
              const cols = Math.min(2, Math.ceil(module.size.width / 60));
              const rows = Math.ceil(Math.min(6, Math.floor((module.size.width * module.size.height) / 2000)) / cols);
              const x = 8 + (i % cols) * ((module.size.width - 16) / cols);
              const y = 8 + Math.floor(i / cols) * ((module.size.height - 16) / rows);
              const width = ((module.size.width - 16) / cols) - 4;
              const height = ((module.size.height - 16) / rows) - 4;
              
              return (
                <rect 
                  key={i}
                  x={x} y={y} 
                  width={width} height={height}
                  fill="none" stroke="#334155" strokeWidth="1"
                />
              );
            })}
          </svg>
        );
      case "accessory-hooks":
        return (
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {/* Hook mounting rail */}
            <line 
              x1="8" y1="20" x2={module.size.width - 8} y2="20"
              stroke="#334155" strokeWidth="2"
            />
            {/* Individual hooks */}
            {[...Array(Math.min(5, Math.floor(module.size.width / 25)))].map((_, i) => {
              const x = 15 + i * ((module.size.width - 30) / Math.max(1, Math.min(4, Math.floor(module.size.width / 25) - 1)));
              return (
                <g key={i}>
                  <line x1={x} y1="20" x2={x} y2="30" stroke="#334155" strokeWidth="2"/>
                  <path d={`M ${x} 30 Q ${x + 3} 33 ${x + 6} 30`} fill="none" stroke="#334155" strokeWidth="2"/>
                </g>
              );
            })}
          </svg>
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
      className={`absolute cursor-pointer select-none transition-all duration-200 ${
        isSelected 
          ? "border-blue-500 shadow-2xl ring-2 ring-blue-300 z-20" 
          : "border-gray-400 hover:border-blue-400 hover:shadow-lg"
      }`}
      style={{
        left: module.position.x,
        top: module.position.y,
        width: module.size.width,
        height: module.size.height,
        ...getBlueprintModuleStyle(),
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Blueprint Module Details */}
      {getBlueprintModuleDetails()}
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full p-2 relative text-gray-800 z-10">
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
          <div className="w-full max-w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isNearFull ? "bg-orange-500" : "bg-blue-500"
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
