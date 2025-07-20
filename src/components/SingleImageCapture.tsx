import { useState } from "react";
import { Camera, X } from "lucide-react";

interface CapturedImage {
  id: string;
  url: string;
  file: File;
}

interface SingleImageCaptureProps {
  onImageChange: (image: CapturedImage | null) => void;
}

export const SingleImageCapture = ({ onImageChange }: SingleImageCaptureProps) => {
  const [image, setImage] = useState<CapturedImage | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImage: CapturedImage = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        file
      };
      
      setImage(newImage);
      onImageChange(newImage);
    }
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      {image ? (
        <div className="relative aspect-square max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-gray-200">
          <img
            src={image.url}
            alt="Captured garment"
            className="w-full h-full object-cover"
          />
          
          {/* Remove button */}
          <div className="absolute top-2 right-2">
            <button
              onClick={removeImage}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-md"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <label className="block aspect-square max-w-xs mx-auto border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
          <Camera className="w-12 h-12 text-gray-400 mb-4" />
          <span className="text-lg text-gray-600 mb-2">Capture Garment</span>
          <span className="text-sm text-gray-500">Click to take photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};