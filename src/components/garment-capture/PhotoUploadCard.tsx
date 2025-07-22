
import React from "react";
import { Camera, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SingleImageCapture } from "../SingleImageCapture";

export interface CapturedImage {
  id: string;
  url: string;
  file: File;
}

interface PhotoUploadCardProps {
  image: CapturedImage | null;
  onImageChange: (image: CapturedImage | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const PhotoUploadCard = ({ 
  image, 
  onImageChange, 
  onAnalyze, 
  isAnalyzing 
}: PhotoUploadCardProps) => {
  return (
    <div className="w-full">
      <div className="bg-card rounded-lg border border-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 py-2 px-3">
          <h3 className="font-medium text-card-foreground flex items-center gap-1.5 text-sm">
            <Camera className="w-4 h-4 text-purple-500" />
            Garment Photo
          </h3>
        </div>
        
        <div className="p-3">
          <SingleImageCapture onImageChange={onImageChange} />
          
          {image && (
            <div className="mt-3">
              <Button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Analyze
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
