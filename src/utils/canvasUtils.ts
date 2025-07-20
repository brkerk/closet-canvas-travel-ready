
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

export const snapToModules = (
  position: CanvasPosition,
  size: CanvasSize,
  modules: CanvasModule[],
  snapDistance: number = 15
): CanvasPosition => {
  let x = position.x;
  let y = position.y;

  // en yakın adayları tutacak
  let bestX = x, bestY = y;
  let minDX = snapDistance + 1, minDY = snapDistance + 1;

  modules.forEach(mod => {
    const left   = mod.position.x;
    const right  = left + mod.size.width;
    const top    = mod.position.y;
    const bottom = top + mod.size.height;

    // X ekseninde: sol kenarımız -> mod.right, sağ kenarımız -> mod.left
    [[ right, Math.abs(x - right) ],
     [ left - size.width, Math.abs(x + size.width - left) ]]
      .forEach(([cand, delta]) => {
        if (delta < minDX) { minDX = delta; bestX = cand as number; }
      });

    // Y ekseninde: üst kenarımız -> mod.bottom, alt kenarımız -> mod.top
    [[ bottom, Math.abs(y - bottom) ],
     [ top - size.height, Math.abs(y + size.height - top) ]]
      .forEach(([cand, delta]) => {
        if (delta < minDY) { minDY = delta; bestY = cand as number; }
      });
  });

  // Eğer kenara kadar yakınsak snap et, değilse özgür kal
  x = minDX <= snapDistance ? bestX : x;
  y = minDY <= snapDistance ? bestY : y;

  // Canvas dışına çıkmasın
  x = Math.max(0, Math.min(x, CANVAS_CONFIG.width  - size.width));
  y = Math.max(0, Math.min(y, CANVAS_CONFIG.height - size.height));

  return { x, y };
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
