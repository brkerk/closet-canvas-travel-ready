
import { useState } from "react";
import { GarmentCard, GarmentData } from "./GarmentCard";
import { Search, Filter, Plus, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GarmentCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
  ]);

  const garmentTypes = ["All", "Tops", "Bottoms", "Outerwear", "Shoes", "Accessories", "Dresses"];

  const filteredGarments = garments.filter(garment => {
    const matchesSearch = garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garment.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         garment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "All" || garment.type === selectedType;
    return matchesSearch && matchesType;
  });

  const toggleFavorite = (id: string) => {
    setGarments(prev => prev.map(garment => 
      garment.id === id ? { ...garment, isFavorite: !garment.isFavorite } : garment
    ));
  };

  const deleteGarment = (id: string) => {
    setGarments(prev => prev.filter(garment => garment.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Garment Catalog</h2>
        <Button className="w-full sm:w-auto" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Garment
        </Button>
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

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {filteredGarments.length} garment{filteredGarments.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Garments Grid/List */}
      <div className={`${
        viewMode === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          : "space-y-3"
      }`}>
        {filteredGarments.map(garment => (
          <GarmentCard
            key={garment.id}
            garment={garment}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteGarment}
            size={viewMode === "grid" ? "medium" : "small"}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredGarments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👔</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No garments found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <Button variant="outline">Clear Filters</Button>
        </div>
      )}
    </div>
  );
};
