
import { useState } from "react";
import { GarmentCard, GarmentData } from "./GarmentCard";
import { Search, Filter, Plus, Grid, List, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GarmentBulkActions } from "./GarmentBulkActions";
import { SmartFilters, SmartFilterOptions } from "./SmartFilters";
import { QuickPreview } from "./QuickPreview";
import { DragDropGarments } from "./DragDropGarments";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

export const GarmentCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quickPreviewGarment, setQuickPreviewGarment] = useState<GarmentData | null>(null);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [smartFilters, setSmartFilters] = useState<SmartFilterOptions>({
    colors: [],
    lastWorn: null,
    wearFrequency: null,
    smartSuggestions: false
  });

  const [garments, setGarments] = useState<GarmentData[]>([
    {
      id: "1",
      name: "Navy Blue Blazer",
      brand: "J.Crew",
      color: "Navy",
      type: "Outerwear",
      tags: ["formal", "work", "versatile"],
      isFavorite: true,
    },
    {
      id: "2",
      name: "White Cotton Shirt",
      brand: "Uniqlo",
      color: "White",
      type: "Tops",
      tags: ["casual", "basic", "everyday"],
      isFavorite: false,
    },
    {
      id: "3",
      name: "Black Leather Boots",
      brand: "Dr. Martens",
      color: "Black",
      type: "Shoes",
      tags: ["casual", "durable", "fall"],
      isFavorite: true,
    },
    {
      id: "4",
      name: "Denim Jeans",
      brand: "Levi's",
      color: "Blue",
      type: "Bottoms",
      tags: ["casual", "everyday", "denim"],
      isFavorite: false,
    },
    {
      id: "5",
      name: "Red Dress",
      brand: "Zara",
      color: "Red",
      type: "Dresses",
      tags: ["formal", "evening", "elegant"],
      isFavorite: true,
    },
  ]);

  const garmentTypes = ["All", "Tops", "Bottoms", "Outerwear", "Shoes", "Accessories", "Dresses"];

  const filteredGarments = garments.filter(garment => {
    const matchesSearch = garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "All" || garment.type === selectedType;
    
    // Smart filters
    const matchesColor = smartFilters.colors.length === 0 || 
      smartFilters.colors.some(color => garment.color.toLowerCase().includes(color.toLowerCase()));
    
    // For demo purposes, we'll simulate other smart filters
    const matchesWearFrequency = !smartFilters.wearFrequency || 
      (Math.random() > 0.5); // Simulate frequency matching
    
    const matchesLastWorn = !smartFilters.lastWorn || 
      (Math.random() > 0.3); // Simulate last worn matching

    return matchesSearch && matchesType && matchesColor && matchesWearFrequency && matchesLastWorn;
  });

  // Keyboard navigation
  const { isSelected } = useKeyboardNavigation({
    items: filteredGarments,
    selectedIndex,
    onSelectionChange: setSelectedIndex,
    onSelect: (garment) => {
      setQuickPreviewGarment(garment);
      setShowQuickPreview(true);
    },
    onBulkSelect: () => {
      if (selectedIndex >= 0 && filteredGarments[selectedIndex]) {
        toggleItemSelection(filteredGarments[selectedIndex].id);
      }
    },
    isEnabled: true
  });

  const toggleFavorite = (id: string) => {
    setGarments(prev => prev.map(garment => 
      garment.id === id ? { ...garment, isFavorite: !garment.isFavorite } : garment
    ));
  };

  const deleteGarment = (id: string) => {
    setGarments(prev => prev.filter(garment => garment.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = (ids: string[]) => {
    setGarments(prev => prev.filter(garment => !ids.includes(garment.id)));
    setSelectedItems([]);
  };

  const handleBulkTag = (ids: string[], tags: string[]) => {
    setGarments(prev => prev.map(garment => 
      ids.includes(garment.id) 
        ? { ...garment, tags: [...new Set([...garment.tags, ...tags])] }
        : garment
    ));
  };

  const handleBulkFavorite = (ids: string[]) => {
    setGarments(prev => prev.map(garment => 
      ids.includes(garment.id) ? { ...garment, isFavorite: true } : garment
    ));
  };

  const handleQuickPreview = (garment: GarmentData) => {
    setQuickPreviewGarment(garment);
    setShowQuickPreview(true);
  };

  const handleReorder = (reorderedGarments: GarmentData[]) => {
    setGarments(reorderedGarments);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Smart Garment Catalog</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setSelectedItems(selectedItems.length === filteredGarments.length ? [] : filteredGarments.map(g => g.id))}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            {selectedItems.length === filteredGarments.length ? 'Deselect All' : 'Select All'}
          </Button>
          <Button className="w-full sm:w-auto" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Garment
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search garments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
            />
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            {/* Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {garmentTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SmartFilters 
                currentFilters={smartFilters}
                onFiltersChange={setSmartFilters}
              />

              {/* View Toggle */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {filteredGarments.length} garment{filteredGarments.length !== 1 ? 's' : ''} found
          {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
        </span>
        <div className="text-xs text-gray-500">
          Use arrow keys to navigate, Space to select, Enter to preview
        </div>
      </div>

      {/* Garments with Drag & Drop */}
      {filteredGarments.length > 0 ? (
        <DragDropGarments
          garments={filteredGarments}
          onReorder={handleReorder}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteGarment}
          onQuickPreview={handleQuickPreview}
          viewMode={viewMode}
        />
      ) : (
        // Empty State
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👔</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No garments found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedType("All");
              setSmartFilters({
                colors: [],
                lastWorn: null,
                wearFrequency: null,
                smartSuggestions: false
              });
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Bulk Actions */}
      <GarmentBulkActions
        selectedItems={selectedItems}
        onBulkDelete={handleBulkDelete}
        onBulkTag={handleBulkTag}
        onBulkFavorite={handleBulkFavorite}
        onClearSelection={() => setSelectedItems([])}
      />

      {/* Quick Preview */}
      <QuickPreview
        garment={quickPreviewGarment}
        isOpen={showQuickPreview}
        onClose={() => setShowQuickPreview(false)}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteGarment}
      />
    </div>
  );
};
