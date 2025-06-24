
import { ClosetModule, ClosetModuleData } from "./ClosetModule";

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
  const cellSize = "w-8 h-8 sm:w-12 sm:h-12"; // Responsive cell sizes

  const handleCellClick = (x: number, y: number) => {
    // Check if there's a module at this position
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

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const module = getModuleAtPosition(x, y);
        const isTopLeft = module && module.position.x === x && module.position.y === y;
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`${cellSize} border border-gray-200 cursor-pointer transition-colors ${
              module
                ? selectedModule === module.id
                  ? "bg-purple-200 border-purple-400"
                  : "bg-gray-100 border-gray-300"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleCellClick(x, y)}
          >
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

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Closet Layout</h3>
        <div className="text-sm text-gray-600">
          {gridSize.width} × {gridSize.height} grid
        </div>
      </div>
      
      <div className="overflow-auto">
        <div
          className="grid gap-0.5 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize.height}, minmax(0, 1fr))`,
            minWidth: `${gridSize.width * 2.5}rem`, // Ensure minimum width for mobile
          }}
        >
          {renderGrid()}
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200 lg:hidden">
        <p className="text-xs text-blue-800">
          💡 Tap modules to select them. Use the module library above to add new modules.
        </p>
      </div>
    </div>
  );
};
