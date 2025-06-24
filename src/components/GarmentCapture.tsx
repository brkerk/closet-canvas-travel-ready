
import { useState } from "react";
import { Camera, Sparkles, Loader2 } from "lucide-react";
import { useGarmentAnalysis } from "@/hooks/useGarmentAnalysis";

export const GarmentCapture = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [garmentData, setGarmentData] = useState({
    name: "",
    brand: "",
    color: "",
    type: "Tops",
    tags: "",
  });

  const { analysis, isAnalyzing, error, analyzeImage, clearAnalysis } = useGarmentAnalysis();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        
        // Create image element for AI analysis
        const img = new Image();
        img.onload = () => {
          setImageElement(img);
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
      clearAnalysis();
    }
  };

  const handleAIAnalysis = async () => {
    if (imageElement) {
      await analyzeImage(imageElement);
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
    console.log("Saving garment:", garmentData);
    alert("Garment saved successfully!");
    
    // Reset form
    setSelectedImage(null);
    setImageElement(null);
    clearAnalysis();
    setGarmentData({
      name: "",
      brand: "",
      color: "",
      type: "Tops",
      tags: "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-pink-100">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Add New Garment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Garment Photo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-8 text-center hover:border-purple-400 transition-colors">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected garment"
                    className="w-32 h-40 sm:w-48 sm:h-64 object-cover mx-auto rounded-xl shadow-md"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImageElement(null);
                        clearAnalysis();
                      }}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleAIAnalysis}
                      disabled={isAnalyzing || !imageElement}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          AI Analyze
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600 mb-2 text-sm sm:text-base">Upload a photo of your garment</p>
                    <label className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl cursor-pointer hover:shadow-md transition-all text-sm sm:text-base">
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Results */}
          {analysis && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Analysis Results
                </h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {Math.round(analysis.confidence * 100)}% confident
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Type:</span> <span className="font-medium">{analysis.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Color:</span> <span className="font-medium">{analysis.color}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Suggested Name:</span> <span className="font-medium">{analysis.suggestedName}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Suggested Tags:</span> <span className="font-medium">{analysis.suggestedTags.join(", ")}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={applyAIResults}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
              >
                Apply AI Suggestions
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">
                <strong>Analysis Error:</strong> {error}
              </p>
              <p className="text-red-500 text-xs mt-1">
                You can still fill out the form manually.
              </p>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Garment Name
              </label>
              <input
                type="text"
                value={garmentData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm sm:text-base"
                placeholder="e.g., Navy Blue Blazer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={garmentData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm sm:text-base"
                placeholder="e.g., J.Crew"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                value={garmentData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm sm:text-base"
                placeholder="e.g., Navy Blue"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={garmentData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white text-sm sm:text-base"
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
                <option value="Dresses">Dresses</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={garmentData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 text-sm sm:text-base"
              placeholder="e.g., formal, work, versatile"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedImage || !garmentData.name || !garmentData.color}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Save Garment to Closet
          </button>
        </form>
      </div>

      {/* Enhanced Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI-Powered Tips
        </h3>
        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
          <li>• Use good lighting for clear photos and better AI recognition</li>
          <li>• Lay garments flat or hang them neatly for optimal analysis</li>
          <li>• Include the full garment in the frame</li>
          <li>• Use a neutral background when possible</li>
          <li>• Let AI analyze your photo for automatic type and color detection!</li>
        </ul>
      </div>
    </div>
  );
};
