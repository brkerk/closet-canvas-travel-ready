
import { useState } from "react";
import { Camera, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CapturedImage {
  id: string;
  url: string;
  angle: string;
  file: File;
}

interface MultiAngleCaptureProps {
  onImagesChange: (images: CapturedImage[]) => void;
  maxImages?: number;
}

export const MultiAngleCapture = ({ onImagesChange, maxImages = 4 }: MultiAngleCaptureProps) => {
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);

  const angles = ["Front", "Back", "Side", "Detail"];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, angle: string) => {
    const file = event.target.files?.[0];
    if (file && images.length < maxImages) {
      const newImage: CapturedImage = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        angle,
        file
      };
      
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      
      // Set first image as primary
      if (!primaryImageId) {
        setPrimaryImageId(newImage.id);
      }
      
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    
    // Update primary if removed
    if (primaryImageId === id) {
      setPrimaryImageId(updatedImages.length > 0 ? updatedImages[0].id : null);
    }
    
    onImagesChange(updatedImages);
  };

  const setPrimary = (id: string) => {
    setPrimaryImageId(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">Multiple Angles</h3>
        <span className="text-sm text-gray-500">{images.length}/{maxImages}</span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
              primaryImageId === image.id ? 'border-purple-400' : 'border-gray-200'
            }`}
          >
            <img
              src={image.url}
              alt={`${image.angle} view`}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute top-2 right-2 flex gap-1">
                {primaryImageId !== image.id && (
                  <button
                    onClick={() => setPrimary(image.id)}
                    className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                  </button>
                )}
                <button
                  onClick={() => removeImage(image.id)}
                  className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                >
                  <X className="w-3 h-3 text-red-600" />
                </button>
              </div>
              
              {primaryImageId === image.id && (
                <div className="absolute bottom-2 left-2">
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    Primary
                  </span>
                </div>
              )}
            </div>
            
            {/* Angle Label */}
            <div className="absolute bottom-2 right-2">
              <span className="bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-full">
                {image.angle}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Image Slots */}
        {images.length < maxImages && angles.slice(images.length).map((angle, index) => (
          <label
            key={angle}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
          >
            <Camera className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">{angle}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, angle)}
              className="hidden"
            />
          </label>
        ))}
      </div>

      {images.length > 0 && (
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="mb-1">📸 <strong>Tip:</strong> Click the checkmark to set a primary image</p>
          <p>Multiple angles help the AI better understand your garment!</p>
        </div>
      )}
    </div>
  );
};
