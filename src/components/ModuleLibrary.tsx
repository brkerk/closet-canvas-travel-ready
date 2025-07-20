
import { Plus, Info } from "lucide-react";
import { ClosetModuleData } from "./ClosetModule";
import { ModulePreview } from "./ModuleIcons";

interface ModuleLibraryProps {
  onAddModule: (moduleType: ClosetModuleData["type"]) => void;
}

export const ModuleLibrary = ({ onAddModule }: ModuleLibraryProps) => {
  const moduleCategories = [
    {
      title: "Hanging Storage",
      modules: [
        {
          type: "hanging-rod" as const,
          name: "Hanging Rod",
          description: "Perfect for shirts, dresses, and jackets",
          width: 1.5,
          height: 2,
          capacity: 12,
          gradient: "from-blue-400 to-blue-600",
          tip: "Best for wrinkle-prone items"
        },
      ]
    },
    {
      title: "Folded Storage",
      modules: [
        {
          type: "shelves" as const,
          name: "Shelves",
          description: "Great for folded clothes and accessories",
          width: 1.5,
          height: 1.5,
          capacity: 8,
          gradient: "from-emerald-400 to-emerald-600",
          tip: "Ideal for t-shirts and sweaters"
        },
        {
          type: "drawers" as const,
          name: "Drawers",
          description: "Organize underwear, socks, and small items",
          width: 1.5,
          height: 1,
          capacity: 20,
          gradient: "from-amber-400 to-amber-600",
          tip: "Perfect for delicate items"
        },
      ]
    },
    {
      title: "Specialized Storage",
      modules: [
        {
          type: "shoe-rack" as const,
          name: "Shoe Rack",
          description: "Dedicated space for shoes and boots",
          width: 1,
          height: 1.5,
          capacity: 6,
          gradient: "from-red-400 to-red-600",
          tip: "Keeps shoes organized and aired"
        },
        {
          type: "accessory-hooks" as const,
          name: "Hooks",
          description: "Hang belts, ties, bags, and scarves",
          width: 1,
          height: 1,
          capacity: 5,
          gradient: "from-purple-400 to-purple-600",
          tip: "Easy access to accessories"
        },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-gray-800">Module Library</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="space-y-6">
        {moduleCategories.map((category) => (
          <div key={category.title}>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-1">
              {category.title}
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {category.modules.map((moduleType) => (
                <button
                  key={moduleType.type}
                  onClick={() => onAddModule(moduleType.type)}
                  className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group relative overflow-hidden hover:shadow-lg"
                >
                  {/* Background gradient preview */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${moduleType.gradient} opacity-5 rounded-full -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moduleType.gradient} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                        <ModulePreview type={moduleType.type} className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800 text-sm">{moduleType.name}</span>
                          <Plus className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{moduleType.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{moduleType.width}×{moduleType.height} units</span>
                          <span>•</span>
                          <span>{moduleType.capacity} items</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-lg border border-blue-100/50">
                      <p className="text-xs text-blue-800 font-medium">💡 {moduleType.tip}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
        <h4 className="font-semibold text-gray-800 text-sm mb-2">Quick Tips</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• Start with hanging rods for your most-worn items</li>
          <li>• Use drawers for items that need to stay folded</li>
          <li>• Place shoe racks at the bottom of your closet</li>
          <li>• Add hooks for frequently used accessories</li>
        </ul>
      </div>
    </div>
  );
};
