
import { ClosetModule, ClosetModuleData } from "./ClosetModule";
import { Grid, Lightbulb } from "lucide-react";

interface ClosetGridProps {
  gridSize: { width: number; height: number };
  modules: ClosetModuleData[];
  selectedModule: string | null;
  onModuleSelect: (moduleId: string | null) => void;
  onModuleMove: (moduleId: string, newPosition: { x: number; y: number }) => void;
  onModuleRemove: (moduleId: string) => void;
}

export const ClosetGrid = ({
  gridSize,
  modules,
  selectedModule,
  onModuleSelect,
  onModuleMove,
  onModuleRemove,
}: ClosetGridProps) => {
  const cellSize = "w-8 h-8 sm:w-12 sm:h-12";

  const handleCellClick = (x: number, y: number) => {
    const moduleAtPosition = modules.find(module =>
      x >= module.position.x &&
      x < module.position.x + module.size.width &&
      y >= module.position.y &&
      y < module.position.y + module.size.height
    );

    if (moduleAtPosition) {
      onModuleSelect(selectedModule === moduleAtPosition.id ? null : moduleAtPosition.id);
    } else {
      onModuleSelect(null);
    }
  };

  const getModuleAtPosition = (x: number, y: number) => {
    return modules.find(module =>
      x >= module.position.x &&
      x < module.position.x + module.size.width &&
      y >= module.position.y &&
      y < module.position.y + module.size.height
    );
  };

  const getEmptySpaceHint = (x: number, y: number) => {
    // Check if this is a good spot for a module
    const hasSpace = !getModuleAtPosition(x, y);
    const hasNeighbor = modules.some(module => 
      Math.abs(module.position.x - x) <= 1 && Math.abs(module.position.y - y) <= 1
    );
    return hasSpace && (modules.length === 0 || hasNeighbor);
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const module = getModuleAtPosition(x, y);
        const isTopLeft = module && module.position.x === x && module.position.y === y;
        const isGoodSpot = getEmptySpaceHint(x, y);
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`${cellSize} border transition-all duration-200 cursor-pointer relative group ${
              module
                ? selectedModule === module.id
                  ? "bg-purple-100 border-purple-400 shadow-sm"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                : isGoodSpot
                ? "bg-white border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleCellClick(x, y)}
          >
            {/* Empty space hint */}
            {!module && isGoodSpot && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              </div>
            )}
            
            {isTopLeft && (
              <ClosetModule
                module={module}
                isSelected={selectedModule === module.id}
                onRemove={() => onModuleRemove(module.id)}
                gridCellSize={cellSize}
              />
            )}
          </div>
        );
      }
    }
    return cells;
  };

  const totalCapacity = modules.reduce((sum, module) => sum + module.capacity, 0);
  const usedCapacity = modules.reduce((sum, module) => sum + module.items.length, 0);
  const usedSpace = modules.reduce((sum, module) => sum + (module.size.width * module.size.height), 0);
  const totalSpace = gridSize.width * gridSize.height;
  const spaceEfficiency = totalSpace > 0 ? Math.round((usedSpace / totalSpace) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-800">Closet Layout</h3>
        </div>
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
          {gridSize.width} × {gridSize.height} grid
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-semibold text-blue-800">{totalCapacity}</div>
          <div className="text-xs text-blue-600">Total Capacity</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm font-semibold text-green-800">{spaceEfficiency}%</div>
          <div className="text-xs text-green-600">Space Used</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm font-semibold text-purple-800">{modules.length}</div>
          <div className="text-xs text-purple-600">Modules</div>
        </div>
      </div>
      
      <div className="overflow-auto">
        <div
          className="grid gap-0.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize.height}, minmax(0, 1fr))`,
            minWidth: `${gridSize.width * 2.5}rem`,
          }}
        >
          {renderGrid()}
        </div>
      </div>

      {/* Enhanced guidance */}
      <div className="mt-4 space-y-3">
        {modules.length === 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 text-sm mb-1">Get Started!</h4>
                <p className="text-xs text-blue-700">
                  Add your first module from the library. Try starting with a hanging rod for your most-worn items.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {modules.length > 0 && spaceEfficiency < 30 && (
          <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-yellow-800">
                💡 You have lots of space! Consider adding more modules to maximize your closet.
              </span>
            </div>
          </div>
        )}
        
        {spaceEfficiency > 80 && (
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-orange-800">
                ⚠️ Your closet is getting full. Consider optimizing your layout.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 lg:hidden">
        <p className="text-xs text-gray-700 flex items-center gap-2">
          <span className="text-sm">📱</span>
          Tap modules to select them. Use the module library to add new storage solutions.
        </p>
      </div>
    </div>
  );
};
