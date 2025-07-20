
import { useState } from "react";
import { ModuleLibrary } from "./ModuleLibrary";
import { ClosetCanvas } from "./ClosetCanvas";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, HelpCircle, Wand2, Users } from "lucide-react";
import { 
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  MODULE_STYLES, 
  findBestCanvasPosition,
  GarmentPreview 
} from "@/utils/canvasUtils";
import { ClosetModuleData } from "./ClosetModule";
import { useGarmentStore } from "@/hooks/useGarmentStore";
import { GarmentAutoAssignmentService, AutoAssignmentResult } from "@/services/garmentAutoAssignment";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const CanvasClosetBuilder = () => {
  const { garments } = useGarmentStore();
  const isMobile = useIsMobile();
  const [autoAssignments, setAutoAssignments] = useState<AutoAssignmentResult[]>([]);
  const [showAssignmentHighlights, setShowAssignmentHighlights] = useState(true);

  // Create an example closet layout similar to the reference image
  const createExampleLayout = (): CanvasModule[] => {
    const exampleModules: CanvasModule[] = [
      // Top row - Storage boxes/shelves
      {
        id: "example-shelf-1",
        type: "shelves",
        position: { x: 20, y: 20 },
        size: { width: 120, height: 80 },
        capacity: 8,
        items: [],
      },
      {
        id: "example-shelf-2",
        type: "shelves",
        position: { x: 160, y: 20 },
        size: { width: 120, height: 80 },
        capacity: 8,
        items: [],
      },
      {
        id: "example-shelf-3",
        type: "shelves",
        position: { x: 300, y: 20 },
        size: { width: 120, height: 80 },
        capacity: 8,
        items: [],
      },
      
      // Left side - Long hanging rod
      {
        id: "example-hanging-1",
        type: "hanging-rod",
        position: { x: 20, y: 120 },
        size: { width: 140, height: 200 },
        capacity: 12,
        items: [],
      },
      
      // Center - Short hanging rod
      {
        id: "example-hanging-2",
        type: "hanging-rod",
        position: { x: 180, y: 120 },
        size: { width: 140, height: 140 },
        capacity: 12,
        items: [],
      },
      
      // Right side - Folded clothes shelves
      {
        id: "example-shelf-4",
        type: "shelves",
        position: { x: 340, y: 120 },
        size: { width: 120, height: 60 },
        capacity: 8,
        items: [],
      },
      {
        id: "example-shelf-5",
        type: "shelves",
        position: { x: 340, y: 200 },
        size: { width: 120, height: 60 },
        capacity: 8,
        items: [],
      },
      
      // Center bottom - More shelves for folded clothes
      {
        id: "example-shelf-6",
        type: "shelves",
        position: { x: 180, y: 280 },
        size: { width: 140, height: 60 },
        capacity: 8,
        items: [],
      },
      
      // Bottom row - Drawers
      {
        id: "example-drawer-1",
        type: "drawers",
        position: { x: 20, y: 340 },
        size: { width: 120, height: 80 },
        capacity: 20,
        items: [],
      },
      {
        id: "example-drawer-2",
        type: "drawers",
        position: { x: 160, y: 340 },
        size: { width: 120, height: 80 },
        capacity: 20,
        items: [],
      },
      {
        id: "example-drawer-3",
        type: "drawers",
        position: { x: 300, y: 340 },
        size: { width: 120, height: 80 },
        capacity: 20,
        items: [],
      },
      
      // Right side - Shoe rack
      {
        id: "example-shoes-1",
        type: "shoe-rack",
        position: { x: 480, y: 120 },
        size: { width: 100, height: 140 },
        capacity: 6,
        items: [],
      },
      
      // Accessories hooks
      {
        id: "example-hooks-1",
        type: "accessory-hooks",
        position: { x: 480, y: 280 },
        size: { width: 100, height: 80 },
        capacity: 5,
        items: [],
      },
    ];
    
    return exampleModules;
  };

  const [modules, setModules] = useState<CanvasModule[]>(() => {
    const initialModules = createExampleLayout();
    // Auto-assign garments to the initial layout
    const { updatedModules, assignments } = GarmentAutoAssignmentService.autoAssignGarments(garments, initialModules);
    setAutoAssignments(assignments);
    return updatedModules;
  });
  
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

  // Auto-assignment functions
  const autoAssignGarments = () => {
    const { updatedModules, assignments } = GarmentAutoAssignmentService.autoAssignGarments(garments, modules);
    setModules(updatedModules);
    setAutoAssignments(assignments);
    
    toast.success(`Auto-assigned ${assignments.length} garments to appropriate modules!`, {
      description: "Review the assignments and make manual adjustments as needed."
    });
  };

  const clearAutoAssignments = () => {
    // Remove all auto-assigned items
    const clearedModules = modules.map(module => ({
      ...module,
      items: module.items.filter(item => !item.isAutoAssigned)
    }));
    setModules(clearedModules);
    setAutoAssignments([]);
    
    toast.info("Cleared all auto-assigned garments", {
      description: "Manual assignments remain in place."
    });
  };

  const addModule = (moduleType: ClosetModuleData["type"]) => {
    const moduleStyle = MODULE_STYLES[moduleType];
    const newModule: CanvasModule = {
      id: `module-${Date.now()}`,
      type: moduleType,
      position: { x: 0, y: 0 },
      size: moduleStyle.minSize,
      capacity: getModuleCapacity(moduleType),
      items: [], // Start empty, let auto-assignment handle it
    };

    const position = findBestCanvasPosition(newModule.size, modules);
    if (position) {
      const newModules = [...modules, { ...newModule, position }];
      setModules(newModules);
      setSelectedModule(newModule.id);
      
      // Trigger auto-assignment for the new module
      const { updatedModules, assignments } = GarmentAutoAssignmentService.autoAssignGarments(garments, newModules);
      setModules(updatedModules);
      setAutoAssignments(prev => [...prev, ...assignments]);
    } else {
      toast.error("No space available for this module", {
        description: "Try clearing some space or removing other modules first."
      });
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
    setAutoAssignments([]);
  };

  const resetToExample = () => {
    const freshLayout = createExampleLayout();
    const { updatedModules, assignments } = GarmentAutoAssignmentService.autoAssignGarments(garments, freshLayout);
    setModules(updatedModules);
    setSelectedModule(null);
    setAutoAssignments(assignments);
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
      {/* Mobile Instructions */}
      {isMobile && (
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Digital Closet
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div>• Drag modules to reposition them</div>
            <div>• Resize modules by dragging corners</div>
            <div>• Green checkmarks show auto-assigned items</div>
            <div>• Manually adjust assignments as needed</div>
            <div>• Save your design when you're happy with it</div>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-pink-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Design Your Dream Closet</h2>
            <p className="text-sm text-gray-600">
              Start with our example layout, then customize it to match your actual closet space and storage needs.
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
              onClick={autoAssignGarments}
              className="flex-1 sm:flex-none"
              size="sm"
              disabled={garments.length === 0 || modules.length === 0}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Auto-Assign
            </Button>
            <Button
              variant="outline"
              onClick={resetToExample}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Example
            </Button>
            <Button
              variant="outline"
              onClick={clearCloset}
              className="flex-1 sm:flex-none"
              size="sm"
            >
              Clear All
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
              Getting Started
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
              <div>• Start with the example layout provided</div>
              <div>• Click "Auto-Assign" to place your garments automatically</div>
              <div>• Add or remove modules to match your closet</div>
              <div>• Drag modules to reposition them</div>
              <div>• Resize modules by dragging corners</div>
              <div>• Green checkmarks show auto-assigned items</div>
              <div>• Manually adjust assignments as needed</div>
              <div>• Save your design when you're happy with it</div>
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
            showAssignmentHighlights={showAssignmentHighlights}
            autoAssignments={autoAssignments}
          />
        </div>
      </div>

      {/* Auto-Assignment Status Panel */}
      {autoAssignments.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-green-800 text-base flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Auto-Assignment Results
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAssignmentHighlights(!showAssignmentHighlights)}
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                {showAssignmentHighlights ? 'Hide' : 'Show'} Highlights
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAutoAssignments}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Clear Auto-Assignments
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">{autoAssignments.length} garments auto-assigned</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-green-700">{garments.length} total garments</span>
              </div>
            </div>
            
            {/* Assignment Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {autoAssignments.slice(0, 6).map((assignment, index) => {
                const garment = garments.find(g => g.id === assignment.garmentId);
                const module = modules.find(m => m.id === assignment.moduleId);
                if (!garment || !module) return null;
                
                return (
                  <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: garment.color.toLowerCase() }}
                      />
                      <span className="font-medium text-gray-800 truncate">{garment.name}</span>
                    </div>
                    <div className="text-xs text-green-700 mb-1">{assignment.reason}</div>
                    <div className="text-xs text-gray-500">
                      Confidence: {Math.round(assignment.confidence * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
            
            {autoAssignments.length > 6 && (
              <div className="text-sm text-green-700 text-center">
                and {autoAssignments.length - 6} more assignments...
              </div>
            )}
          </div>
        </div>
      )}

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
