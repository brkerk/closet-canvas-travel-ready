
import { useState } from "react";
import { Filter, Calendar, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SmartFiltersProps {
  onFiltersChange: (filters: SmartFilterOptions) => void;
  currentFilters: SmartFilterOptions;
}

export interface SmartFilterOptions {
  colors: string[];
  lastWorn: 'week' | 'month' | 'season' | null;
  wearFrequency: 'high' | 'medium' | 'low' | null;
  smartSuggestions: boolean;
}

export const SmartFilters = ({ onFiltersChange, currentFilters }: SmartFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    'Black', 'White', 'Navy', 'Gray', 'Brown', 'Red', 'Blue', 
    'Green', 'Yellow', 'Pink', 'Purple', 'Orange'
  ];

  const toggleColor = (color: string) => {
    const newColors = currentFilters.colors.includes(color)
      ? currentFilters.colors.filter(c => c !== color)
      : [...currentFilters.colors, color];
    
    onFiltersChange({ ...currentFilters, colors: newColors });
  };

  const setLastWorn = (period: SmartFilterOptions['lastWorn']) => {
    onFiltersChange({ 
      ...currentFilters, 
      lastWorn: currentFilters.lastWorn === period ? null : period 
    });
  };

  const setWearFrequency = (frequency: SmartFilterOptions['wearFrequency']) => {
    onFiltersChange({ 
      ...currentFilters, 
      wearFrequency: currentFilters.wearFrequency === frequency ? null : frequency 
    });
  };

  const activeFiltersCount = 
    currentFilters.colors.length + 
    (currentFilters.lastWorn ? 1 : 0) + 
    (currentFilters.wearFrequency ? 1 : 0) +
    (currentFilters.smartSuggestions ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`relative ${activeFiltersCount > 0 ? 'bg-purple-50 border-purple-300' : ''}`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Smart Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          {/* Color Filters */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Colors
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    currentFilters.colors.includes(color)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Last Worn */}
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Last Worn
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'week' as const, label: 'This Week' },
                { key: 'month' as const, label: 'This Month' },
                { key: 'season' as const, label: 'This Season' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setLastWorn(key)}
                  className={`px-3 py-2 text-xs rounded border transition-colors ${
                    currentFilters.lastWorn === key
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Wear Frequency */}
          <div>
            <h4 className="font-medium text-sm mb-2">Wear Frequency</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'high' as const, label: 'Often' },
                { key: 'medium' as const, label: 'Sometimes' },
                { key: 'low' as const, label: 'Rarely' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setWearFrequency(key)}
                  className={`px-2 py-1 text-xs rounded border transition-colors ${
                    currentFilters.wearFrequency === key
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Suggestions */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.smartSuggestions}
                onChange={(e) => onFiltersChange({ 
                  ...currentFilters, 
                  smartSuggestions: e.target.checked 
                })}
                className="rounded"
              />
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm">Show AI Suggestions</span>
            </label>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFiltersChange({
                colors: [],
                lastWorn: null,
                wearFrequency: null,
                smartSuggestions: false
              })}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
