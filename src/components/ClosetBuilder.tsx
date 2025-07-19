
import { useState } from "react";
import { ModuleLibrary } from "./ModuleLibrary";
import { ClosetGrid } from "./ClosetGrid";
import { ClosetModule, ClosetModuleData } from "./ClosetModule";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, Settings, HelpCircle } from "lucide-react";

export const ClosetBuilder = () => {
  const [gridSize, setGridSize] = useState({ width: 6, height: 8 });
  const [modules, setModules] = useState<ClosetModuleData[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  const addModule = (moduleType: ClosetModuleData["type"]) => {
    const newModule: ClosetModuleData = {
      id: `module-${Date.now()}`,
      type: moduleType,
      position: { x: 0, y: 0 },
      size: getModuleSize(moduleType),
      capacity: getModuleCapacity(moduleType),
      items: [],
    };

    const position = findBestPosition(newModule);
    if (position) {
      setModules(prev => [...prev, { ...newModule, position }]);
      setSelectedModule(newModule.id);
    } else {
      // Show user feedback that no space is available
      alert("No space available for this module. Try clearing some space or removing other modules first.");
    }
  };

  const getModuleSize = (type: ClosetModuleData["type"]) => {
    const sizes = {
      "hanging-rod": { width: 2, height: 3 },
      "shelves": { width: 2, height: 2 },
      "drawers": { width: 2, height: 1 },
      "shoe-rack": { width: 1, height: 2 },
      "accessory-hooks": { width: 1, height: 1 },
    };
    return sizes[type];
  };

  const getModuleCapacity = (type: ClosetModuleData["type"]) => {
    const capacities = {
      "hanging-rod": 12,
      "shelves": 8,
      "drawers": 20,
      "shoe-rack": 6,
      "accessory-hooks": 5,
    };
    return capacities[type];
  };

  const findBestPosition = (module: ClosetModuleData) => {
    // Try to place near existing modules first
    for (let y = 0; y <= gridSize.height - module.size.height; y++) {
      for (let x = 0; x <= gridSize.width - module.size.width; x++) {
        if (isPositionAvailable(x, y, module.size)) {
          return { x, y };
        }
      }
    }
    return null;
  };

  const isPositionAvailable = (x: number, y: number, size: { width: number; height: number }) => {
    for (let dy = 0; dy < size.height; dy++) {
      for (let dx = 0; dx < size.width; dx++) {
        const checkX = x + dx;
        const checkY = y + dy;
        
        if (modules.some(module => 
          checkX >= module.position.x && 
          checkX < module.position.x + module.size.width &&
          checkY >= module.position.y && 
          checkY < module.position.y + module.size.height
        )) {
          return false;
        }
      }
    }
    return true;
  };

  const moveModule = (moduleId: string, newPosition: { x: number; y: number }) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, position: newPosition } : module
    ));
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
    if (selectedModule === moduleId) {
      setSelectedModule(null);
    }
  };

  const clearCloset = () => {
    setModules([]);
    setSelectedModule(null);
  };

  const saveCloset = () => {
    console.log("Saving closet configuration:", { gridSize, modules });
    // Here you would save to backend/localStorage
    alert("Closet design saved successfully! 🎉");
  };

  const getLayoutScore = () => {
    if (modules.length === 0) return 0;
    
    const spaceUsed = modules.reduce((sum, module) => sum + (module.size.width * module.size.height), 0);
    const totalSpace = gridSize.width * gridSize.height;
    const efficiency = (spaceUsed / totalSpace) * 100;
    
    // Bonus points for having different types of storage
    const uniqueTypes = new Set(modules.map(m => m.type)).size;
    const varietyBonus = uniqueTypes * 5;
    
    return Math.min(100, Math.round(efficiency + varietyBonus));
  };

  const layoutScore = getLayoutScore();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-pink-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Design Your Dream Closet</h2>
            <p className="text-sm text-gray-600">
              Create the perfect storage solution for your wardrobe. Mix and match modules to fit your needs.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowTips(!showTips)}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Tips
            </Button>
            <Button
              variant="outline"
              onClick={clearCloset}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={saveCloset}
              className="flex-1 sm:flex-none"
              size="sm"
              disabled={modules.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Design
            </Button>
          </div>
        </div>
        
        {/* Layout Score */}
        {modules.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Layout Score:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  layoutScore >= 70 ? 'bg-green-500' : 
                  layoutScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${layoutScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-800">{layoutScore}/100</span>
          </div>
        )}
      </div>

      {/* Tips Panel */}
      {showTips && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Pro Tips for Closet Design
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
            <div>• Start with hanging rods for daily wear</div>
            <div>• Use drawers for delicate items</div>
            <div>• Place shoe racks at floor level</div>
            <div>• Add hooks for easy access items</div>
            <div>• Leave some empty space for flexibility</div>
            <div>• Group similar storage types together</div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Module Library */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ModuleLibrary onAddModule={addModule} />
        </div>

        {/* Closet Grid */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <ClosetGrid
            gridSize={gridSize}
            modules={modules}
            selectedModule={selectedModule}
            onModuleSelect={setSelectedModule}
            onModuleMove={moveModule}
            onModuleRemove={removeModule}
          />
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
        <h3 className="font-bold text-gray-800 mb-4 text-base">Closet Analytics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{modules.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Storage Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">
              {modules.reduce((sum, module) => sum + module.capacity, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round((modules.reduce((sum, module) => sum + (module.size.width * module.size.height), 0) / (gridSize.width * gridSize.height)) * 100)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Space Efficiency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Set(modules.map(m => m.type)).size}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Storage Types</div>
          </div>
        </div>
        
        {/* Storage breakdown */}
        {modules.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-700 mb-2 text-sm">Storage Breakdown:</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(modules.map(m => m.type))).map(type => {
                const count = modules.filter(m => m.type === type).length;
                const typeNames = {
                  "hanging-rod": "Hanging Rods",
                  "shelves": "Shelves",
                  "drawers": "Drawers",
                  "shoe-rack": "Shoe Racks",
                  "accessory-hooks": "Hooks"
                };
                return (
                  <span key={type} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                    {count}x {typeNames[type]}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
