
import React from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { GarmentData } from "./types";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

interface EnhancedDetailsFieldsProps {
  garmentData: GarmentData;
  handleInputChange: (field: string, value: string) => void;
}

export const EnhancedDetailsFields = ({ garmentData, handleInputChange }: EnhancedDetailsFieldsProps) => {
  const seasons = ["Spring", "Summer", "Fall", "Winter", "All Seasons"];
  const occasions = ["Casual", "Work", "Formal", "Sport", "Evening", "Special"];
  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Denim", "Leather", "Linen", "Blend"];

  return (
    <Accordion type="single" collapsible className="w-full border-t border-border pt-1">
      <AccordionItem value="enhanced-details" className="border-b-0">
        <AccordionTrigger className="py-3 hover:bg-background/80">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Enhanced Details
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="pt-2 pb-3">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Season
                </label>
                <select
                  value={garmentData.season}
                  onChange={(e) => handleInputChange("season", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Occasion
                </label>
                <select
                  value={garmentData.occasion}
                  onChange={(e) => handleInputChange("occasion", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                >
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                Material
              </label>
              <select
                value={garmentData.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
              >
                <option value="">Select material...</option>
                {materials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={garmentData.purchaseDate}
                  onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Price
                </label>
                <input
                  type="number"
                  value={garmentData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
