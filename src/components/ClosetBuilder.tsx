
import { useState } from "react";
import { ModuleLibrary } from "./ModuleLibrary";
import { ClosetGrid } from "./ClosetGrid";
import { ClosetModule, ClosetModuleData } from "./ClosetModule";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save } from "lucide-react";

export const ClosetBuilder = () => {
  const [gridSize, setGridSize] = useState({ width: 6, height: 8 });
  const [modules, setModules] = useState<ClosetModuleData[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const addModule = (moduleType: ClosetModuleData["type"]) => {
    const newModule: ClosetModuleData = {
      id: `module-${Date.now()}`,
      type: moduleType,
      position: { x: 0, y: 0 },
      size: getModuleSize(moduleType),
      capacity: getModuleCapacity(moduleType),
      items: [],
    };

    // Find the best position for the new module
    const position = findBestPosition(newModule);
    if (position) {
      setModules(prev => [...prev, { ...newModule, position }]);
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
  };

  const clearCloset = () => {
    setModules([]);
    setSelectedModule(null);
  };

  const saveCloset = () => {
    console.log("Saving closet configuration:", { gridSize, modules });
    // Here you would save to backend/localStorage
    alert("Closet saved successfully!");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Build Your Closet</h2>
        <div className="flex gap-2 w-full sm:w-auto">
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
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Mobile-First Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Module Library - Full width on mobile */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ModuleLibrary onAddModule={addModule} />
        </div>

        {/* Closet Grid - Full width on mobile */}
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

      {/* Mobile Statistics */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Closet Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{modules.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Modules</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">
              {modules.reduce((sum, module) => sum + module.capacity, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Capacity</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round((modules.length / (gridSize.width * gridSize.height)) * 100)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Space Used</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {gridSize.width * gridSize.height - modules.reduce((sum, module) => sum + (module.size.width * module.size.height), 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Free Slots</div>
          </div>
        </div>
      </div>
    </div>
  );
};
