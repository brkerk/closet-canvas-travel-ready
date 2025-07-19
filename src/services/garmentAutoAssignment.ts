import { GarmentData } from "@/components/GarmentCard";
import { CanvasModule, GarmentPreview } from "@/utils/canvasUtils";

export interface AutoAssignmentResult {
  moduleId: string;
  garmentId: string;
  confidence: number;
  reason: string;
  isAutoAssigned: true;
}

export interface AssignmentRule {
  garmentTypes: string[];
  moduleTypes: string[];
  priority: number;
  condition?: (garment: GarmentData) => boolean;
}

// Define smart assignment rules based on garment and module compatibility
const ASSIGNMENT_RULES: AssignmentRule[] = [
  // High priority rules
  {
    garmentTypes: ["Dresses", "Outerwear"],
    moduleTypes: ["hanging-rod"],
    priority: 10,
    condition: (garment) => !garment.tags.includes("fold-only")
  },
  {
    garmentTypes: ["Shoes"],
    moduleTypes: ["shoe-rack"],
    priority: 10
  },
  {
    garmentTypes: ["Accessories"],
    moduleTypes: ["accessory-hooks", "drawers"],
    priority: 8,
    condition: (garment) => garment.tags.includes("jewelry") || garment.tags.includes("belt") || garment.tags.includes("bag")
  },
  
  // Medium priority rules
  {
    garmentTypes: ["Tops"],
    moduleTypes: ["hanging-rod", "shelves"],
    priority: 7,
    condition: (garment) => {
      // Prefer hanging for formal tops, shelves for casual
      const isFormal = garment.tags.some(tag => ["formal", "work", "dress"].includes(tag.toLowerCase()));
      const isDelicate = garment.tags.some(tag => ["silk", "delicate", "blouse"].includes(tag.toLowerCase()));
      return isFormal || isDelicate;
    }
  },
  {
    garmentTypes: ["Bottoms"],
    moduleTypes: ["hanging-rod", "shelves", "drawers"],
    priority: 6,
    condition: (garment) => {
      // Prefer hanging for dress pants, folding for jeans
      const isDressPants = garment.tags.some(tag => ["formal", "work", "dress", "trousers"].includes(tag.toLowerCase()));
      return isDressPants;
    }
  },
  
  // Lower priority fallback rules
  {
    garmentTypes: ["Tops"],
    moduleTypes: ["shelves"],
    priority: 5,
    condition: (garment) => garment.tags.some(tag => ["casual", "t-shirt", "sweater"].includes(tag.toLowerCase()))
  },
  {
    garmentTypes: ["Bottoms"],
    moduleTypes: ["shelves", "drawers"],
    priority: 4
  },
  {
    garmentTypes: ["Accessories"],
    moduleTypes: ["drawers"],
    priority: 3
  }
];

export class GarmentAutoAssignmentService {
  /**
   * Automatically assigns garments to the most appropriate modules
   */
  static autoAssignGarments(
    garments: GarmentData[], 
    modules: CanvasModule[]
  ): { assignments: AutoAssignmentResult[], updatedModules: CanvasModule[] } {
    const assignments: AutoAssignmentResult[] = [];
    const updatedModules = [...modules];
    
    // Sort garments by priority (favorites first, then by type priority)
    const sortedGarments = [...garments].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

    for (const garment of sortedGarments) {
      const assignment = this.findBestModule(garment, updatedModules);
      
      if (assignment) {
        assignments.push(assignment);
        
        // Update the module with the assigned garment
        const moduleIndex = updatedModules.findIndex(m => m.id === assignment.moduleId);
        if (moduleIndex !== -1) {
          const garmentPreview: GarmentPreview = {
            id: garment.id,
            name: garment.name,
            color: this.parseColor(garment.color),
            type: this.mapGarmentTypeToPreviewType(garment.type),
            isAutoAssigned: true
          };
          
          updatedModules[moduleIndex] = {
            ...updatedModules[moduleIndex],
            items: [...updatedModules[moduleIndex].items, garmentPreview]
          };
        }
      }
    }

    return { assignments, updatedModules };
  }

  /**
   * Finds the best module for a specific garment
   */
  private static findBestModule(
    garment: GarmentData, 
    modules: CanvasModule[]
  ): AutoAssignmentResult | null {
    let bestMatch: {
      module: CanvasModule;
      score: number;
      rule: AssignmentRule;
    } | null = null;

    // Find matching rules for this garment type
    const applicableRules = ASSIGNMENT_RULES.filter(rule => 
      rule.garmentTypes.includes(garment.type) &&
      (!rule.condition || rule.condition(garment))
    );

    for (const rule of applicableRules) {
      for (const module of modules) {
        if (!rule.moduleTypes.includes(module.type)) continue;
        
        // Check if module has capacity
        const availableSpace = module.capacity - module.items.length;
        if (availableSpace <= 0) continue;

        // Calculate assignment score
        const score = this.calculateAssignmentScore(garment, module, rule);
        
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { module, score, rule };
        }
      }
    }

    if (!bestMatch) return null;

    const reason = this.generateAssignmentReason(garment, bestMatch.module, bestMatch.rule);

    return {
      moduleId: bestMatch.module.id,
      garmentId: garment.id,
      confidence: Math.min(bestMatch.score / 100, 1),
      reason,
      isAutoAssigned: true
    };
  }

  /**
   * Calculates how well a garment fits a specific module
   */
  private static calculateAssignmentScore(
    garment: GarmentData,
    module: CanvasModule,
    rule: AssignmentRule
  ): number {
    let score = rule.priority * 10; // Base score from rule priority

    // Bonus for exact type match
    const exactTypeMatch = this.getExactTypeMatch(garment.type, module.type);
    score += exactTypeMatch * 20;

    // Penalty for overcrowding
    const utilizationRate = module.items.length / module.capacity;
    score -= utilizationRate * 15;

    // Bonus for color coordination (group similar colors)
    const colorBonus = this.getColorCoordinationBonus(garment, module);
    score += colorBonus;

    // Bonus for tag-based preferences
    const tagBonus = this.getTagBonus(garment, module);
    score += tagBonus;

    return Math.max(0, score);
  }

  private static getExactTypeMatch(garmentType: string, moduleType: string): number {
    const perfectMatches: Record<string, string[]> = {
      "Shoes": ["shoe-rack"],
      "Dresses": ["hanging-rod"],
      "Outerwear": ["hanging-rod"],
      "Accessories": ["accessory-hooks"]
    };

    return perfectMatches[garmentType]?.includes(moduleType) ? 1 : 0;
  }

  private static getColorCoordinationBonus(garment: GarmentData, module: CanvasModule): number {
    const garmentColor = garment.color.toLowerCase();
    const similarColors = module.items.filter(item => 
      item.color && this.areColorsSimilar(garmentColor, item.color)
    );
    
    return Math.min(similarColors.length * 2, 10);
  }

  private static getTagBonus(garment: GarmentData, module: CanvasModule): number {
    let bonus = 0;
    
    // Formal items prefer hanging
    if (garment.tags.includes("formal") && module.type === "hanging-rod") {
      bonus += 5;
    }
    
    // Casual items can go on shelves
    if (garment.tags.includes("casual") && module.type === "shelves") {
      bonus += 3;
    }
    
    // Delicate items prefer hanging
    if (garment.tags.some(tag => ["silk", "delicate"].includes(tag)) && module.type === "hanging-rod") {
      bonus += 8;
    }

    return bonus;
  }

  private static areColorsSimilar(color1: string, color2: string): boolean {
    // Simple color similarity check
    const normalizedColor1 = color1.toLowerCase().replace(/\s+/g, '');
    const normalizedColor2 = color2.toLowerCase().replace(/\s+/g, '');
    
    return normalizedColor1 === normalizedColor2 || 
           normalizedColor1.includes(normalizedColor2) || 
           normalizedColor2.includes(normalizedColor1);
  }

  private static generateAssignmentReason(
    garment: GarmentData,
    module: CanvasModule,
    rule: AssignmentRule
  ): string {
    const moduleNames = {
      "hanging-rod": "hanging rod",
      "shelves": "shelf",
      "drawers": "drawer",
      "shoe-rack": "shoe rack",
      "accessory-hooks": "hooks"
    };

    const moduleName = moduleNames[module.type] || module.type;

    if (garment.type === "Shoes" && module.type === "shoe-rack") {
      return `Shoes automatically placed on ${moduleName}`;
    }
    
    if (garment.type === "Dresses" && module.type === "hanging-rod") {
      return `Dress hung on ${moduleName} to prevent wrinkles`;
    }
    
    if (garment.tags.includes("formal") && module.type === "hanging-rod") {
      return `Formal wear hung on ${moduleName} for wrinkle prevention`;
    }
    
    if (garment.tags.includes("casual") && module.type === "shelves") {
      return `Casual item folded on ${moduleName} to save space`;
    }

    return `${garment.type} assigned to ${moduleName} based on type compatibility`;
  }

  /**
   * Converts garment color string to hex-like format
   */
  private static parseColor(colorStr: string): string {
    const colorMap: Record<string, string> = {
      "red": "#EF4444",
      "blue": "#3B82F6", 
      "navy": "#1E40AF",
      "green": "#10B981",
      "black": "#1F2937",
      "white": "#F9FAFB",
      "gray": "#6B7280",
      "grey": "#6B7280",
      "brown": "#92400E",
      "pink": "#EC4899",
      "purple": "#8B5CF6",
      "yellow": "#F59E0B",
      "orange": "#F97316"
    };

    const normalized = colorStr.toLowerCase().trim();
    return colorMap[normalized] || "#6B7280";
  }

  /**
   * Maps garment type to canvas preview type
   */
  private static mapGarmentTypeToPreviewType(garmentType: string): "shirt" | "pants" | "dress" | "jacket" | "shoes" | "accessory" {
    const typeMap: Record<string, "shirt" | "pants" | "dress" | "jacket" | "shoes" | "accessory"> = {
      "Tops": "shirt",
      "Bottoms": "pants", 
      "Dresses": "dress",
      "Outerwear": "jacket",
      "Shoes": "shoes",
      "Accessories": "accessory"
    };

    return typeMap[garmentType] || "shirt";
  }

  /**
   * Re-assigns garments when modules change
   */
  static rebalanceAssignments(
    modules: CanvasModule[],
    garments: GarmentData[]
  ): CanvasModule[] {
    // Clear all auto-assigned items
    const clearedModules = modules.map(module => ({
      ...module,
      items: module.items.filter(item => !(item as any).isAutoAssigned)
    }));

    // Re-assign all garments
    const { updatedModules } = this.autoAssignGarments(garments, clearedModules);
    
    return updatedModules;
  }
}