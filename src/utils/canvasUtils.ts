
export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface GarmentPreview {
  id: string;
  name: string;
  color: string;
  type: "shirt" | "pants" | "dress" | "jacket" | "shoes" | "accessory";
  thumbnail?: string;
  isAutoAssigned?: boolean; // New field to track auto-assigned items
}

export interface CanvasModule {
  id: string;
  type: "hanging-rod" | "shelves" | "drawers" | "shoe-rack" | "accessory-hooks";
  position: CanvasPosition;
  size: CanvasSize;
  capacity: number;
  items: GarmentPreview[];
}

export const CANVAS_CONFIG = {
  width: 800,
  height: 600,
  gridSize: 20,
  moduleMinHeight: 60,
  moduleMinWidth: 100,
} as const;

export const MODULE_STYLES = {
  "hanging-rod": {
    color: "#3B82F6",
    pattern: "vertical-lines",
    minSize: { width: 120, height: 180 }
  },
  "shelves": {
    color: "#10B981",
    pattern: "horizontal-lines",
    minSize: { width: 120, height: 120 }
  },
  "drawers": {
    color: "#F59E0B",
    pattern: "grid",
    minSize: { width: 120, height: 80 }
  },
  "shoe-rack": {
    color: "#EF4444",
    pattern: "dots",
    minSize: { width: 80, height: 120 }
  },
  "accessory-hooks": {
    color: "#8B5CF6",
    pattern: "diagonal",
    minSize: { width: 60, height: 60 }
  }
} as const;

export const snapToGrid = (value: number, gridSize: number = CANVAS_CONFIG.gridSize): number => {
  return Math.round(value / gridSize) * gridSize;
};

// Free positioning - minimal constraints for maximum flexibility
export const snapToModulesAndGrid = (
  position: CanvasPosition,
  size: CanvasSize,
  modules: CanvasModule[],
  snapDistance: number = 15
): CanvasPosition => {
  // Return position as-is for completely free movement
  // Only ensure it stays within canvas boundaries
  return {
    x: Math.max(0, Math.min(position.x, CANVAS_CONFIG.width - size.width)),
    y: Math.max(0, Math.min(position.y, CANVAS_CONFIG.height - size.height))
  };
};

export const isPositionValid = (
  position: CanvasPosition,
  size: CanvasSize,
  modules: CanvasModule[],
  canvasSize: CanvasSize = { width: CANVAS_CONFIG.width, height: CANVAS_CONFIG.height }
): boolean => {
  // Check canvas boundaries
  if (position.x < 0 || position.y < 0) return false;
  if (position.x + size.width > canvasSize.width) return false;
  if (position.y + size.height > canvasSize.height) return false;

  // Check collision with other modules
  return !modules.some(module => 
    !(position.x >= module.position.x + module.size.width ||
      position.x + size.width <= module.position.x ||
      position.y >= module.position.y + module.size.height ||
      position.y + size.height <= module.position.y)
  );
};

export const findBestCanvasPosition = (
  size: CanvasSize,
  modules: CanvasModule[],
  canvasSize: CanvasSize = { width: CANVAS_CONFIG.width, height: CANVAS_CONFIG.height }
): CanvasPosition | null => {
  const gridSize = CANVAS_CONFIG.gridSize;
  
  for (let y = 0; y <= canvasSize.height - size.height; y += gridSize) {
    for (let x = 0; x <= canvasSize.width - size.width; x += gridSize) {
      const position = { x, y };
      if (isPositionValid(position, size, modules, canvasSize)) {
        return position;
      }
    }
  }
  return null;
};
