
import { useState } from "react";
import { Sparkles, RefreshCw, Heart, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GarmentThumbnail } from "./GarmentThumbnail";
import { GarmentPreview } from "@/utils/canvasUtils";

interface OutfitRecommendation {
  id: string;
  name: string;
  occasion: string;
  season: string;
  confidence: number;
  items: GarmentPreview[];
  tags: string[];
}

export const SmartOutfitRecommendations = () => {
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([
    {
      id: "1",
      name: "Professional Chic",
      occasion: "Work",
      season: "Fall",
      confidence: 92,
      items: [
        { id: "1", name: "Navy Blazer", color: "#1E3A8A", type: "jacket" },
        { id: "2", name: "White Shirt", color: "#F9FAFB", type: "shirt" },
        { id: "3", name: "Black Trousers", color: "#111827", type: "pants" },
        { id: "4", name: "Black Pumps", color: "#111827", type: "shoes" },
      ],
      tags: ["formal", "versatile", "classic"]
    },
    {
      id: "2",
      name: "Weekend Casual",
      occasion: "Casual",
      season: "All Seasons",
      confidence: 87,
      items: [
        { id: "5", name: "Denim Jacket", color: "#1E40AF", type: "jacket" },
        { id: "6", name: "Striped Tee", color: "#F3F4F6", type: "shirt" },
        { id: "7", name: "Dark Jeans", color: "#1F2937", type: "pants" },
        { id: "8", name: "White Sneakers", color: "#F9FAFB", type: "shoes" },
      ],
      tags: ["comfortable", "trendy", "everyday"]
    },
    {
      id: "3",
      name: "Date Night Elegant",
      occasion: "Evening",
      season: "Spring",
      confidence: 95,
      items: [
        { id: "9", name: "Little Black Dress", color: "#111827", type: "dress" },
        { id: "10", name: "Statement Necklace", color: "#D4AF37", type: "accessory" },
        { id: "11", name: "Heeled Sandals", color: "#8B4513", type: "shoes" },
      ],
      tags: ["elegant", "sophisticated", "romantic"]
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateNewRecommendations = async () => {
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Shuffle existing recommendations for demo
    const shuffled = [...recommendations].sort(() => Math.random() - 0.5);
    setRecommendations(shuffled);
    setIsGenerating(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getOccasionIcon = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case "work": return "💼";
      case "casual": return "👕";
      case "evening": return "🌙";
      case "formal": return "👔";
      default: return "✨";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Smart Outfit Recommendations
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered outfit suggestions based on your wardrobe
          </p>
        </div>
        <Button
          onClick={generateNewRecommendations}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
          size="sm"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Ideas
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {recommendations.map((outfit) => (
          <div
            key={outfit.id}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getOccasionIcon(outfit.occasion)}</span>
                  <h4 className="font-semibold text-gray-800">{outfit.name}</h4>
                  <span className={`text-sm font-medium ${getConfidenceColor(outfit.confidence)}`}>
                    {outfit.confidence}% match
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {outfit.occasion}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {outfit.season}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-gray-700">Items:</span>
              <div className="flex gap-2">
                {outfit.items.map((item) => (
                  <GarmentThumbnail
                    key={item.id}
                    garment={item}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {outfit.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Styling Tips
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Mix textures and patterns for visual interest</p>
          <p>• Consider the weather and occasion when selecting outfits</p>
          <p>• Confidence scores are based on color harmony and style compatibility</p>
          <p>• Save your favorite combinations for quick access</p>
        </div>
      </div>
    </div>
  );
};
