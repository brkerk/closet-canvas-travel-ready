
import { useState } from "react";
import { Camera, Sparkles, Loader2, Wand2 } from "lucide-react";
import { useGarmentAnalysis } from "@/hooks/useGarmentAnalysis";
import { SingleImageCapture } from "./SingleImageCapture";
import { Button } from "@/components/ui/button";

interface CapturedImage {
  id: string;
  url: string;
  file: File;
}

export const EnhancedGarmentCapture = () => {
  const [image, setImage] = useState<CapturedImage | null>(null);
  const [garmentData, setGarmentData] = useState({
    name: "",
    brand: "",
    color: "",
    type: "Tops",
    tags: "",
    season: "All Seasons",
    occasion: "Casual",
    material: "",
    purchaseDate: "",
    price: "",
  });

  const { analysis, isAnalyzing, error, analyzeImage, clearAnalysis } = useGarmentAnalysis();

  const seasons = ["Spring", "Summer", "Fall", "Winter", "All Seasons"];
  const occasions = ["Casual", "Work", "Formal", "Sport", "Evening", "Special"];
  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Denim", "Leather", "Linen", "Blend"];

  const handleImageChange = (newImage: CapturedImage | null) => {
    setImage(newImage);
    clearAnalysis();
  };

  const handleAIAnalysis = async () => {
    if (image) {
      const img = new Image();
      img.onload = async () => {
        await analyzeImage(img);
      };
      img.src = image.url;
    }
  };

  const applyAIResults = () => {
    if (analysis) {
      setGarmentData(prev => ({
        ...prev,
        name: analysis.suggestedName,
        color: analysis.color,
        type: analysis.type,
        tags: analysis.suggestedTags.join(", ")
      }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setGarmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving enhanced garment:", { ...garmentData, image });
    alert("Garment saved successfully with enhanced data!");
    
    // Reset form
    setImage(null);
    clearAnalysis();
    setGarmentData({
      name: "",
      brand: "",
      color: "",
      type: "Tops",
      tags: "",
      season: "All Seasons",
      occasion: "Casual",
      material: "",
      purchaseDate: "",
      price: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-500" />
          Smart Garment Capture
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Single Photo Capture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Garment Photo
            </label>
            <SingleImageCapture onImageChange={handleImageChange} />
            
            {image && (
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:shadow-lg transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Smart Analysis
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* AI Analysis Results */}
          {analysis && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Enhanced AI Analysis
                </h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {Math.round(analysis.confidence * 100)}% confident
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-gray-600">Type:</span> <span className="font-medium">{analysis.type}</span></div>
                <div><span className="text-gray-600">Color:</span> <span className="font-medium">{analysis.color}</span></div>
                <div className="col-span-2"><span className="text-gray-600">Name:</span> <span className="font-medium">{analysis.suggestedName}</span></div>
                <div className="col-span-2"><span className="text-gray-600">Tags:</span> <span className="font-medium">{analysis.suggestedTags.join(", ")}</span></div>
              </div>
              
              <Button
                type="button"
                onClick={applyAIResults}
                className="w-full bg-purple-500 hover:bg-purple-600"
                size="sm"
              >
                Apply Smart Suggestions
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">
                <strong>Analysis Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Enhanced Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Garment Name</label>
                <input
                  type="text"
                  value={garmentData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g., Navy Blue Blazer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={garmentData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="e.g., J.Crew"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={garmentData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="Navy Blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={garmentData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
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
            </div>

            {/* Enhanced Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800 border-b pb-2">Enhanced Details</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                  <select
                    value={garmentData.season}
                    onChange={(e) => handleInputChange("season", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm"
                  >
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                  <select
                    value={garmentData.occasion}
                    onChange={(e) => handleInputChange("occasion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm"
                  >
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>{occasion}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <select
                  value={garmentData.material}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                >
                  <option value="">Select material...</option>
                  {materials.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={garmentData.purchaseDate}
                    onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    value={garmentData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={garmentData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              placeholder="e.g., formal, work, versatile, professional"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!image || !garmentData.name || !garmentData.color}
            className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            Save Enhanced Garment to Closet
          </Button>
        </form>
      </div>

      {/* Enhanced Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Smart Capture Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <ul className="space-y-2">
            <li>• 📸 Capture clear photos with good lighting</li>
            <li>• 💡 Use neutral backgrounds for best results</li>
            <li>• 🎯 Focus on the garment details</li>
          </ul>
          <ul className="space-y-2">
            <li>• 🏷️ Add detailed tags for better organization</li>
            <li>• 📅 Track purchase dates and prices</li>
            <li>• ✨ Let AI suggest optimal categorization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
