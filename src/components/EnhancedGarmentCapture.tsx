
import { useState } from "react";
import { Camera, Sparkles, Loader2, Wand2, Tag, Info } from "lucide-react";
import { useGarmentAnalysis } from "@/hooks/useGarmentAnalysis";
import { SingleImageCapture } from "./SingleImageCapture";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="h-screen flex flex-col bg-background">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-border p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
          <Wand2 className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
          Smart Garment Capture
        </h2>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            {/* Photo Capture Section */}
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-medium text-card-foreground">Garment Photo</h3>
              </div>
              
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div><span className="text-gray-600">Type:</span> <span className="font-medium">{analysis.type}</span></div>
                  <div><span className="text-gray-600">Color:</span> <span className="font-medium">{analysis.color}</span></div>
                  <div className="sm:col-span-2"><span className="text-gray-600">Name:</span> <span className="font-medium">{analysis.suggestedName}</span></div>
                  <div className="sm:col-span-2"><span className="text-gray-600">Tags:</span> <span className="font-medium">{analysis.suggestedTags.join(", ")}</span></div>
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
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                <p className="text-destructive text-sm">
                  <strong>Analysis Error:</strong> {error}
                </p>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-medium text-card-foreground">Basic Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    value={garmentData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="e.g., Navy Blue Blazer"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={garmentData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      placeholder="e.g., J.Crew"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Type
                    </label>
                    <select
                      value={garmentData.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
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
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    value={garmentData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Navy Blue"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tags Section - Separate and Prominent */}
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-medium text-card-foreground">Tags</h3>
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  Help organize your closet
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={garmentData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  placeholder="e.g., formal, work, versatile, professional"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate tags with commas for better organization
                </p>
              </div>
            </div>

            {/* Enhanced Details Section */}
            <div className="bg-card rounded-2xl p-4 md:p-6 shadow-sm border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-medium text-card-foreground">Enhanced Details</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Season
                    </label>
                    <select
                      value={garmentData.season}
                      onChange={(e) => handleInputChange("season", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    >
                      {seasons.map(season => (
                        <option key={season} value={season}>{season}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Occasion
                    </label>
                    <select
                      value={garmentData.occasion}
                      onChange={(e) => handleInputChange("occasion", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    >
                      {occasions.map(occasion => (
                        <option key={occasion} value={occasion}>{occasion}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Material
                  </label>
                  <select
                    value={garmentData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  >
                    <option value="">Select material...</option>
                    {materials.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={garmentData.purchaseDate}
                      onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      value={garmentData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ScrollArea>

      {/* Fixed Submit Button */}
      <div className="flex-shrink-0 bg-white border-t border-border p-4 md:hidden">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!image || !garmentData.name || !garmentData.color}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          Save Enhanced Garment to Closet
        </Button>
      </div>

      {/* Desktop Submit Button */}
      <div className="hidden md:block max-w-4xl mx-auto p-6">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!image || !garmentData.name || !garmentData.color}
          className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          Save Enhanced Garment to Closet
        </Button>
      </div>

      {/* Smart Capture Tips */}
      <div className="hidden md:block max-w-4xl mx-auto px-6 pb-6">
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
    </div>
  );
};
