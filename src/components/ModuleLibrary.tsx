
import { Plus, Info } from "lucide-react";
import { ClosetModuleData } from "./ClosetModule";

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
          icon: "👔",
          description: "Perfect for shirts, dresses, and jackets",
          width: 2,
          height: 3,
          capacity: 12,
          color: "from-blue-400 to-blue-600",
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
          icon: "📚",
          description: "Great for folded clothes and accessories",
          width: 2,
          height: 2,
          capacity: 8,
          color: "from-green-400 to-green-600",
          tip: "Ideal for t-shirts and sweaters"
        },
        {
          type: "drawers" as const,
          name: "Drawers",
          icon: "🗃️",
          description: "Organize underwear, socks, and small items",
          width: 2,
          height: 1,
          capacity: 20,
          color: "from-yellow-400 to-yellow-600",
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
          icon: "👟",
          description: "Dedicated space for shoes and boots",
          width: 1,
          height: 2,
          capacity: 6,
          color: "from-red-400 to-red-600",
          tip: "Keeps shoes organized and aired"
        },
        {
          type: "accessory-hooks" as const,
          name: "Hooks",
          icon: "👜",
          description: "Hang belts, ties, bags, and scarves",
          width: 1,
          height: 1,
          capacity: 5,
          color: "from-purple-400 to-purple-600",
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
                  className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group relative overflow-hidden"
                >
                  {/* Background gradient preview */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${moduleType.color} opacity-10 rounded-full -mr-8 -mt-8 group-hover:opacity-20 transition-opacity`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${moduleType.color} flex items-center justify-center text-white shadow-sm`}>
                        <span className="text-lg">{moduleType.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800 text-sm">{moduleType.name}</span>
                          <Plus className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{moduleType.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{moduleType.width}×{moduleType.height} grid</span>
                          <span>•</span>
                          <span>{moduleType.capacity} items</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 px-3 py-2 rounded-lg">
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
