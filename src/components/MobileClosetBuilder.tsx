
import { useState } from "react";
import { ModuleLibrary } from "./ModuleLibrary";
import { Button } from "@/components/ui/button";
import { RotateCcw, Save, HelpCircle, Wand2 } from "lucide-react";
import { 
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  MODULE_STYLES, 
  findBestCanvasPosition,
} from "@/utils/canvasUtils";
import { ClosetModuleData } from "./ClosetModule";
import { useGarmentStore } from "@/hooks/useGarmentStore";
import { GarmentAutoAssignmentService, AutoAssignmentResult } from "@/services/garmentAutoAssignment";
import { toast } from "sonner";
import { CanvasModule as CanvasModuleComponent } from "./CanvasModule";
import { ModulePreview } from "./ModuleIcons";

export const MobileClosetBuilder = () => {
  const { garments } = useGarmentStore();
  const [autoAssignments, setAutoAssignments] = useState<AutoAssignmentResult[]>([]);

  // Simple mobile layout - grid of modules
  const [modules, setModules] = useState<CanvasModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

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

  const addModule = (moduleType: ClosetModuleData["type"]) => {
    const moduleStyle = MODULE_STYLES[moduleType];
    const newModule: CanvasModule = {
      id: `module-${Date.now()}`,
      type: moduleType,
      position: { x: 20 + (modules.length % 2) * 120, y: 20 + Math.floor(modules.length / 2) * 100 }, // Adjusted spacing
      size: { width: moduleStyle.minSize.width + 20, height: moduleStyle.minSize.height + 20 }, // Slightly larger than minimum
      capacity: getModuleCapacity(moduleType),
      items: [],
    };

    setModules(prev => [...prev, newModule]);
    setSelectedModule(newModule.id);
    
    // Auto-assign garments
    const { updatedModules, assignments } = GarmentAutoAssignmentService.autoAssignGarments(garments, [...modules, newModule]);
    setModules(updatedModules);
    setAutoAssignments(prev => [...prev, ...assignments]);
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

  const autoAssignGarments = () => {
    const { updatedModules, assignments } = GarmentAutoAssignmentService.autoAssignGarments(garments, modules);
    setModules(updatedModules);
    setAutoAssignments(assignments);
    
    toast.success(`Auto-assigned ${assignments.length} garments!`);
  };

  const saveCloset = () => {
    console.log("Saving mobile closet configuration:", { modules });
    toast.success("Closet design saved! 🎉");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800 mb-2">Digital Closet</h1>
        
        {/* Quick Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-100">
          <div className="space-y-1 text-sm text-blue-700">
            <div>• Drag modules to reposition them</div>
            <div>• Resize modules by dragging corners</div>
            <div>• Green checkmarks show auto-assigned items</div>
            <div>• Manually adjust assignments as needed</div>
            <div>• Save your design when you're happy with it</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={autoAssignGarments}
            className="flex-1"
            size="sm"
            disabled={garments.length === 0 || modules.length === 0}
          >
            <Wand2 className="w-4 h-4 mr-1" />
            Auto-Assign
          </Button>
          <Button
            variant="outline"
            onClick={clearCloset}
            className="flex-1"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button
            onClick={saveCloset}
            className="flex-1"
            size="sm"
            disabled={modules.length === 0}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden bg-white">
        {/* Canvas Header */}
        <div className="p-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Closet Elevation View</h3>
          <p className="text-sm text-gray-600">Tap modules below to add them, then drag to arrange</p>
        </div>

        {/* Mobile Module Library - Horizontal Scroll */}
        <div className="p-3 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Add Storage Modules</h4>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[
              { type: "hanging-rod", name: "Hanging Rod", gradient: "from-blue-400 to-blue-600" },
              { type: "shelves", name: "Shelves", gradient: "from-emerald-400 to-emerald-600" },
              { type: "drawers", name: "Drawers", gradient: "from-amber-400 to-amber-600" },
              { type: "shoe-rack", name: "Shoe Rack", gradient: "from-red-400 to-red-600" },
              { type: "accessory-hooks", name: "Hooks", gradient: "from-purple-400 to-purple-600" },
            ].map(({ type, name, gradient }) => (
              <button
                key={type}
                onClick={() => addModule(type as ClosetModuleData["type"])}
                className={`flex-shrink-0 bg-gradient-to-br ${gradient} rounded-xl p-3 min-w-[80px] text-center border border-white/20 hover:shadow-lg transition-all duration-200 text-white group`}
              >
                <div className="mb-2 flex justify-center">
                  <ModulePreview type={type as ClosetModuleData["type"]} className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs font-medium">{name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Simple Canvas */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-auto">
          <div 
            className="relative"
            style={{ 
              width: '100%',
              minHeight: '400px',
            }}
          >
            {/* Simple floor line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line 
                x1="0" 
                y1="380" 
                x2="100%" 
                y2="380"
                stroke="rgba(0,0,0,0.15)" 
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>

            {/* Modules */}
            {modules.map((module) => (
              <CanvasModuleComponent
                key={module.id}
                module={module}
                isSelected={selectedModule === module.id}
                onSelect={() => setSelectedModule(module.id)}
                onRemove={() => removeModule(module.id)}
                onUpdatePosition={(position) => moveModule(module.id, position)}
                onUpdateSize={(size) => resizeModule(module.id, size)}
                allModules={modules}
              />
            ))}

            {/* Empty state */}
            {modules.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500 p-4">
                  <div className="text-4xl mb-3">🏠</div>
                  <p className="text-lg font-medium mb-2">Start Your Closet Design</p>
                  <p className="text-sm">Tap modules above to create your perfect layout</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-Assignment Status */}
      {autoAssignments.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-800 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {autoAssignments.length} garments auto-assigned
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoAssignments([])}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
