
import { useState } from "react";
import { Search } from "lucide-react";
import { GarmentCard } from "./GarmentCard";

// Mock data for garments
const mockGarments = [
  {
    id: "1",
    name: "Navy Blue Blazer",
    brand: "J.Crew",
    color: "Navy",
    type: "Outerwear",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop",
    tags: ["formal", "work", "versatile"],
  },
  {
    id: "2",
    name: "White Cotton Shirt",
    brand: "Uniqlo",
    color: "White",
    type: "Tops",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop",
    tags: ["casual", "work", "basic"],
  },
  {
    id: "3",
    name: "Black Jeans",
    brand: "Levi's",
    color: "Black",
    type: "Bottoms",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop",
    tags: ["casual", "versatile"],
  },
  {
    id: "4",
    name: "Red Silk Scarf",
    brand: "Hermès",
    color: "Red",
    type: "Accessories",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=400&fit=crop",
    tags: ["luxury", "accent"],
  },
];

export const GarmentCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const types = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

  const filteredGarments = mockGarments.filter((garment) => {
    const matchesSearch = garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      garment.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || garment.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wardrobe</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search garments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 bg-white"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{mockGarments.length}</p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-600">4</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">12</p>
            <p className="text-sm text-gray-600">Outfits Created</p>
          </div>
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600">3</p>
            <p className="text-sm text-gray-600">Favorites</p>
          </div>
        </div>
      </div>

      {/* Garment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGarments.map((garment) => (
          <GarmentCard key={garment.id} garment={garment} />
        ))}
      </div>
    </div>
  );
};
