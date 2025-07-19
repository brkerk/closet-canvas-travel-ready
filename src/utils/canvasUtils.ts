
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

// Enhanced snapping that aligns modules edge-to-edge with proper row/column alignment
export const snapToModulesAndGrid = (
  position: CanvasPosition,
  size: CanvasSize,
  modules: CanvasModule[],
  snapDistance: number = 15
): CanvasPosition => {
  let { x, y } = position;
  
  // First, try to snap to existing module rows and columns
  for (const module of modules) {
    const moduleLeft = module.position.x;
    const moduleRight = module.position.x + module.size.width;
    const moduleTop = module.position.y;
    const moduleBottom = module.position.y + module.size.height;
    
    // Horizontal alignment - snap to same Y position as existing modules
    if (Math.abs(y - moduleTop) < snapDistance) {
      y = moduleTop; // Align to top of existing module
    }
    if (Math.abs(y - moduleBottom) < snapDistance) {
      y = moduleBottom; // Align to bottom of existing module
    }
    
    // Vertical alignment - snap to same X position as existing modules  
    if (Math.abs(x - moduleLeft) < snapDistance) {
      x = moduleLeft; // Align to left of existing module
    }
    if (Math.abs(x - moduleRight) < snapDistance) {
      x = moduleRight; // Align to right of existing module
    }
    
    // Edge-to-edge snapping
    // Snap to right edge of existing module (place next to it)
    if (Math.abs(x - moduleRight) < snapDistance && Math.abs(y - moduleTop) < snapDistance * 2) {
      x = moduleRight;
      y = moduleTop; // Also align vertically
    }
    
    // Snap to left edge of existing module
    if (Math.abs(x + size.width - moduleLeft) < snapDistance && Math.abs(y - moduleTop) < snapDistance * 2) {
      x = moduleLeft - size.width;
      y = moduleTop; // Also align vertically
    }
    
    // Snap below existing module
    if (Math.abs(y - moduleBottom) < snapDistance && Math.abs(x - moduleLeft) < snapDistance * 2) {
      y = moduleBottom;
      x = moduleLeft; // Also align horizontally
    }
    
    // Snap above existing module  
    if (Math.abs(y + size.height - moduleTop) < snapDistance && Math.abs(x - moduleLeft) < snapDistance * 2) {
      y = moduleTop - size.height;
      x = moduleLeft; // Also align horizontally
    }
  }
  
  // Ensure grid alignment
  return {
    x: snapToGrid(x),
    y: snapToGrid(y)
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
