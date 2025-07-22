
import { Camera, Info } from "lucide-react";
import { GarmentData } from "./types";

interface BasicInfoFieldsProps {
  garmentData: GarmentData;
  handleInputChange: (field: string, value: string) => void;
}

export const BasicInfoFields = ({ garmentData, handleInputChange }: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4 w-full">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Garment Name *
        </label>
        <input
          type="text"
          value={garmentData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          placeholder="e.g., Navy Blue Blazer"
          required
        />
        {garmentData.name === "" && (
          <p className="text-xs text-destructive mt-1">Required field</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">
            Brand
          </label>
          <input
            type="text"
            value={garmentData.brand}
            onChange={(e) => handleInputChange("brand", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
            placeholder="e.g., J.Crew"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1.5">
            Type
          </label>
          <select
            value={garmentData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          >
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Outerwear">Outerwear</option>
            <option value="Dresses">Dresses</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Color *
        </label>
        <input
          type="text"
          value={garmentData.color}
          onChange={(e) => handleInputChange("color", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
          placeholder="Navy Blue"
          required
        />
        {garmentData.color === "" && (
          <p className="text-xs text-destructive mt-1">Required field</p>
        )}
      </div>
    </div>
  );
};
