
import { useState } from "react";
import { Shuffle, Heart, Share, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutfitData {
  id: string;
  name: string;
  occasion: string;
  weather: string;
  items: {
    top?: string;
    bottom?: string;
    outerwear?: string;
    shoes?: string;
    accessories?: string[];
  };
  isFavorite: boolean;
}

export const OutfitRecommendations = () => {
  const [selectedOccasion, setSelectedOccasion] = useState("Work");
  const [selectedWeather, setSelectedWeather] = useState("Mild");
  const [outfits, setOutfits] = useState<OutfitData[]>([
    {
      id: "1",
      name: "Professional Ensemble",
      occasion: "Work",
      weather: "Mild",
      items: {
        top: "White Cotton Shirt",
        bottom: "Black Trousers",
        outerwear: "Navy Blue Blazer",
        shoes: "Black Leather Shoes",
        accessories: ["Watch", "Belt"],
      },
      isFavorite: true,
    },
    {
      id: "2",
      name: "Casual Weekend",
      occasion: "Casual",
      weather: "Warm",
      items: {
        top: "Striped T-Shirt",
        bottom: "Denim Jeans",
        shoes: "White Sneakers",
        accessories: ["Sunglasses"],
      },
      isFavorite: false,
    },
  ]);

  const occasions = ["Work", "Casual", "Formal", "Date", "Travel", "Exercise"];
  const weatherOptions = ["Cold", "Mild", "Warm", "Hot", "Rainy"];

  const generateOutfit = () => {
    // Simple outfit generation logic - in a real app this would be more sophisticated
    const newOutfit: OutfitData = {
      id: `outfit-${Date.now()}`,
      name: `${selectedOccasion} Outfit`,
      occasion: selectedOccasion,
      weather: selectedWeather,
      items: {
        top: "Generated Top",
        bottom: "Generated Bottom",
        shoes: "Generated Shoes",
      },
      isFavorite: false,
    };
    setOutfits(prev => [newOutfit, ...prev]);
  };

  const toggleFavorite = (id: string) => {
    setOutfits(prev => prev.map(outfit => 
      outfit.id === id ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit
    ));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Outfit Recommendations</h2>
        <Button onClick={generateOutfit} className="w-full sm:w-auto" size="sm">
          <Shuffle className="w-4 h-4 mr-2" />
          Generate Outfit
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-pink-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white text-sm"
            >
              {occasions.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weather</label>
            <select
              value={selectedWeather}
              onChange={(e) => setSelectedWeather(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white text-sm"
            >
              {weatherOptions.map(weather => (
                <option key={weather} value={weather}>{weather}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Outfits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {outfits.map(outfit => (
          <div key={outfit.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{outfit.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(outfit.id)}
                  className={`p-2 rounded-full transition-colors ${
                    outfit.isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart className="w-4 h-4" fill={outfit.isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg">{outfit.occasion}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg">{outfit.weather}</span>
              </div>

              <div className="space-y-2">
                {outfit.items.top && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-gray-600">Top: {outfit.items.top}</span>
                  </div>
                )}
                {outfit.items.bottom && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    <span className="text-gray-600">Bottom: {outfit.items.bottom}</span>
                  </div>
                )}
                {outfit.items.outerwear && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    <span className="text-gray-600">Outerwear: {outfit.items.outerwear}</span>
                  </div>
                )}
                {outfit.items.shoes && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    <span className="text-gray-600">Shoes: {outfit.items.shoes}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                Plan
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {outfits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No outfits yet</h3>
          <p className="text-gray-600 mb-4">Generate your first outfit recommendation</p>
          <Button onClick={generateOutfit}>
            <Shuffle className="w-4 h-4 mr-2" />
            Generate Outfit
          </Button>
        </div>
      )}
    </div>
  );
};
