
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
      <div className="card-header" style={{ background: 'hsl(var(--color-primary))', color: 'white', padding: '16px', borderRadius: '12px 12px 0 0' }}>
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Garment Photo
        </div>
      </div>
      
      <div className="bg-card border-x border-b rounded-b-lg">
        <div className="p-4">
          {image ? (
            <div className="space-y-3">
              <div className="relative">
                <img 
                  src={image.url} 
                  alt="Captured garment" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <Button
                type="button"
                onClick={onAnalyze}
                disabled={isAnalyzing}
                className="w-full"
                style={{ background: 'hsl(var(--color-primary))' }}
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
          ) : (
            <div 
              className="uploader flex flex-col items-center justify-center cursor-pointer"
              style={{
                minHeight: '180px',
                border: '1px dashed hsl(var(--color-border))',
                borderRadius: '8px',
                marginTop: '8px'
              }}
            >
              <SingleImageCapture onImageChange={onImageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
