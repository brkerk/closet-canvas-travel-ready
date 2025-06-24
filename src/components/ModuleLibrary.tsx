
import { Plus } from "lucide-react";
import { ClosetModuleData } from "./ClosetModule";

interface ModuleLibraryProps {
  onAddModule: (moduleType: ClosetModuleData["type"]) => void;
}

export const ModuleLibrary = ({ onAddModule }: ModuleLibraryProps) => {
  const moduleTypes = [
    {
      type: "hanging-rod" as const,
      name: "Hanging Rod",
      icon: "👔",
      description: "For shirts, dresses, jackets",
      width: 2,
      height: 3,
      capacity: 12,
    },
    {
      type: "shelves" as const,
      name: "Shelves",
      icon: "📚",
      description: "For folded clothes, bags",
      width: 2,
      height: 2,
      capacity: 8,
    },
    {
      type: "drawers" as const,
      name: "Drawers",
      icon: "🗃️",
      description: "For underwear, socks",
      width: 2,
      height: 1,
      capacity: 20,
    },
    {
      type: "shoe-rack" as const,
      name: "Shoe Rack",
      icon: "👟",
      description: "For shoes, boots",
      width: 1,
      height: 2,
      capacity: 6,
    },
    {
      type: "accessory-hooks" as const,
      name: "Hooks",
      icon: "👜",
      description: "For belts, ties, bags",
      width: 1,
      height: 1,
      capacity: 5,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Module Library</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {moduleTypes.map((moduleType) => (
          <button
            key={moduleType.type}
            onClick={() => onAddModule(moduleType.type)}
            className="p-3 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{moduleType.icon}</span>
              <span className="font-medium text-gray-800 text-sm">{moduleType.name}</span>
              <Plus className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
            </div>
            <p className="text-xs text-gray-600 mb-1">{moduleType.description}</p>
            <div className="text-xs text-gray-500">
              {moduleType.width}×{moduleType.height} • {moduleType.capacity} items
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
