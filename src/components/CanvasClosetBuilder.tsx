
import { useState } from "react";
import { ModuleLibrary } from "./ModuleLibrary";
import { ClosetCanvas } from "./ClosetCanvas";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, HelpCircle } from "lucide-react";
import { 
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  MODULE_STYLES, 
  findBestCanvasPosition,
  GarmentPreview 
} from "@/utils/canvasUtils";
import { ClosetModuleData } from "./ClosetModule";

export const CanvasClosetBuilder = () => {
  const [modules, setModules] = useState<CanvasModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

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

  const getSampleGarments = (moduleType: ClosetModuleData["type"]): GarmentPreview[] => {
    const garmentLibrary = {
      "hanging-rod": [
        { id: "g1", name: "Blue Shirt", color: "#3B82F6", type: "shirt" as const },
        { id: "g2", name: "Black Dress", color: "#1F2937", type: "dress" as const },
        { id: "g3", name: "Green Jacket", color: "#10B981", type: "jacket" as const },
      ],
      "shelves": [
        { id: "g4", name: "White T-Shirt", color: "#F9FAFB", type: "shirt" as const },
        { id: "g5", name: "Gray Sweater", color: "#6B7280", type: "shirt" as const },
      ],
      "drawers": [
        { id: "g6", name: "Blue Jeans", color: "#1E40AF", type: "pants" as const },
        { id: "g7", name: "Black Pants", color: "#111827", type: "pants" as const },
        { id: "g8", name: "Brown Belt", color: "#92400E", type: "accessory" as const },
      ],
      "shoe-rack": [
        { id: "g9", name: "Sneakers", color: "#EF4444", type: "shoes" as const },
        { id: "g10", name: "Black Boots", color: "#1F2937", type: "shoes" as const },
      ],
      "accessory-hooks": [
        { id: "g11", name: "Leather Bag", color: "#92400E", type: "accessory" as const },
        { id: "g12", name: "Silver Watch", color: "#9CA3AF", type: "accessory" as const },
      ],
    };
    
    const items = garmentLibrary[moduleType] || [];
    // Randomly select 1-3 items for demonstration
    const count = Math.min(Math.floor(Math.random() * 3) + 1, items.length);
    return items.slice(0, count);
  };

  const addModule = (moduleType: ClosetModuleData["type"]) => {
    const moduleStyle = MODULE_STYLES[moduleType];
    const newModule: CanvasModule = {
      id: `module-${Date.now()}`,
      type: moduleType,
      position: { x: 0, y: 0 },
      size: moduleStyle.minSize,
      capacity: getModuleCapacity(moduleType),
      items: getSampleGarments(moduleType),
    };

    const position = findBestCanvasPosition(newModule.size, modules);
    if (position) {
      setModules(prev => [...prev, { ...newModule, position }]);
      setSelectedModule(newModule.id);
    } else {
      // Show user feedback that no space is available
      alert("No space available for this module. Try clearing some space or removing other modules first.");
    }
  };

  const moveModule = (moduleId: string, newPosition: CanvasPosition) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, position: newPosition } : module
    ));
  };

  const resizeModule = (moduleId: string, newSize: CanvasSize) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, size: newSize } : module
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
    console.log("Saving canvas closet configuration:", { modules });
    // Here you would save to backend/localStorage
    alert("Closet design saved successfully! 🎉");
  };

  const getLayoutScore = () => {
    if (modules.length === 0) return 0;
    
    const totalModuleArea = modules.reduce((sum, module) => sum + (module.size.width * module.size.height), 0);
    const canvasArea = 800 * 600; // CANVAS_CONFIG dimensions
    const efficiency = (totalModuleArea / canvasArea) * 100;
    
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
              Create the perfect storage solution with our new canvas-based designer. Drag, resize, and arrange modules freely.
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
            Canvas Designer Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
            <div>• Drag modules anywhere on the canvas</div>
            <div>• Resize modules by dragging the resize handle</div>
            <div>• Modules snap to grid for perfect alignment</div>
            <div>• Click empty space to deselect modules</div>
            <div>• Use different module types for variety</div>
            <div>• Plan your layout before adding modules</div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Module Library */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ModuleLibrary onAddModule={addModule} />
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <ClosetCanvas
            modules={modules}
            selectedModule={selectedModule}
            onModuleSelect={setSelectedModule}
            onModuleMove={moveModule}
            onModuleResize={resizeModule}
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
              {Math.round((modules.reduce((sum, module) => sum + (module.size.width * module.size.height), 0) / (800 * 600)) * 100)}%
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
