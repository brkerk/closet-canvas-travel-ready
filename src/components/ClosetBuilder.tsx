
import { useState } from "react";
import { ClosetModule, ClosetModuleData } from "./ClosetModule";
import { ModuleLibrary } from "./ModuleLibrary";
import { Shuffle, Save, Trash2 } from "lucide-react";

export const ClosetBuilder = () => {
  const [modules, setModules] = useState<ClosetModuleData[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [gridSize] = useState({ width: 6, height: 8 });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addModule = (type: ClosetModuleData["type"]) => {
    const moduleSpecs = {
      "hanging-rod": { width: 2, height: 3, capacity: 12 },
      "shelves": { width: 2, height: 2, capacity: 8 },
      "drawers": { width: 2, height: 1, capacity: 20 },
      "shoe-rack": { width: 1, height: 2, capacity: 6 },
      "accessory-hooks": { width: 1, height: 1, capacity: 5 },
    };

    const spec = moduleSpecs[type];
    const newModule: ClosetModuleData = {
      id: generateId(),
      type,
      width: spec.width,
      height: spec.height,
      position: { x: 0, y: 0 },
      items: [],
      capacity: spec.capacity,
    };

    setModules(prev => [...prev, newModule]);
  };

  const updateModule = (updatedModule: ClosetModuleData) => {
    setModules(prev => prev.map(module => 
      module.id === updatedModule.id ? updatedModule : module
    ));
  };

  const removeModule = (id: string) => {
    setModules(prev => prev.filter(module => module.id !== id));
    if (selectedModuleId === id) {
      setSelectedModuleId(null);
    }
  };

  const autoArrange = () => {
    const arranged = [...modules];
    let currentRow = 0;
    let currentCol = 0;

    arranged.forEach(module => {
      if (currentCol + module.width > gridSize.width) {
        currentRow += 1;
        currentCol = 0;
      }
      
      module.position = { x: currentCol, y: currentRow };
      currentCol += module.width;
    });

    setModules(arranged);
  };

  const clearAll = () => {
    setModules([]);
    setSelectedModuleId(null);
  };

  return (
    <div className="space-y-6">
      <ModuleLibrary onAddModule={addModule} />
      
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Closet Designer</h3>
          <div className="flex gap-2">
            <button
              onClick={autoArrange}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-xl hover:shadow-md transition-all text-sm"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Auto Arrange</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-xl hover:shadow-md transition-all text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl hover:shadow-md transition-all text-sm">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {modules.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏗️</span>
            </div>
            <h4 className="text-lg font-medium mb-2">Start Building Your Closet</h4>
            <p className="text-sm">Choose modules from the library above to design your perfect closet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div 
              className="inline-grid gap-2 min-w-full p-4 bg-gray-50 rounded-xl"
              style={{
                gridTemplateColumns: `repeat(${gridSize.width}, minmax(60px, 1fr))`,
                gridTemplateRows: `repeat(${gridSize.height}, 60px)`,
              }}
            >
              {modules.map(module => (
                <ClosetModule
                  key={module.id}
                  module={module}
                  onUpdate={updateModule}
                  onRemove={removeModule}
                  isSelected={selectedModuleId === module.id}
                  onSelect={setSelectedModuleId}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {modules.length > 0 && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Your Closet Stats</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Modules:</span>
              <span className="font-medium ml-1">{modules.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Capacity:</span>
              <span className="font-medium ml-1">{modules.reduce((sum, m) => sum + m.capacity, 0)}</span>
            </div>
            <div>
              <span className="text-gray-600">Items Stored:</span>
              <span className="font-medium ml-1">{modules.reduce((sum, m) => sum + m.items.length, 0)}</span>
            </div>
            <div>
              <span className="text-gray-600">Space Used:</span>
              <span className="font-medium ml-1">
                {Math.round((modules.reduce((sum, m) => sum + m.items.length, 0) / 
                  Math.max(modules.reduce((sum, m) => sum + m.capacity, 0), 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
