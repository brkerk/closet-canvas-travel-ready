
import { useState } from "react";
import { Wand2, Info, AlertCircle } from "lucide-react";
import { useGarmentAnalysis } from "@/hooks/useGarmentAnalysis";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PhotoUploadCard, CapturedImage } from "./garment-capture/PhotoUploadCard";
import { BasicInfoFields } from "./garment-capture/BasicInfoFields";
import { TagsInput } from "./garment-capture/TagsInput";
import { EnhancedDetailsFields } from "./garment-capture/EnhancedDetailsFields";
import { AIAnalysisPanel } from "./garment-capture/AIAnalysisPanel";
import { GarmentData } from "./garment-capture/types";
import { useIsMobile } from "@/hooks/use-mobile";

export const EnhancedGarmentCapture = () => {
  const isMobile = useIsMobile();
  const [image, setImage] = useState<CapturedImage | null>(null);
  const [garmentData, setGarmentData] = useState<GarmentData>({
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

  const isSubmitDisabled = !image || !garmentData.name || !garmentData.color;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-border px-4 py-3">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          Smart Garment Capture
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 pb-32">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            {/* Photo Upload Section */}
            <PhotoUploadCard 
              image={image}
              onImageChange={handleImageChange}
              onAnalyze={handleAIAnalysis}
              isAnalyzing={isAnalyzing}
            />
            
            {/* AI Analysis Results */}
            {analysis && (
              <AIAnalysisPanel analysis={analysis} onApply={applyAIResults} />
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-destructive text-xs flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span><strong>Analysis Error:</strong> {error}</span>
                </p>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="w-full bg-white rounded-lg p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-3">
                <Info className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Basic Information</h3>
              </div>
              
              <BasicInfoFields 
                garmentData={garmentData} 
                handleInputChange={handleInputChange} 
              />
            </div>

            {/* Tags Section */}
            <div className="w-full p-3">
              <TagsInput 
                tags={garmentData.tags} 
                onChange={(value) => handleInputChange("tags", value)} 
              />
            </div>

            {/* Enhanced Details Section */}
            <EnhancedDetailsFields 
              garmentData={garmentData} 
              handleInputChange={handleInputChange} 
            />
          </form>
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-3 shadow-md">
        <div className="max-w-md mx-auto">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50"
          >
            {isSubmitDisabled ? (
              "Complete Required Fields"
            ) : (
              "Save Garment to Closet"
            )}
          </Button>
          
          {isSubmitDisabled && (
            <p className="text-xs text-muted-foreground text-center mt-1">
              Please add a photo, name, and color
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
