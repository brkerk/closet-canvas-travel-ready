
import { useState, useEffect } from "react";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import { NativeCameraService } from "@/services/nativeCamera";
import { Button } from "@/components/ui/button";

interface CapturedImage {
  id: string;
  url: string;
  file?: File;
  blob?: Blob;
}

interface SingleImageCaptureProps {
  onImageChange: (image: CapturedImage | null) => void;
}

export const SingleImageCapture = ({ onImageChange }: SingleImageCaptureProps) => {
  const [image, setImage] = useState<CapturedImage | null>(null);
  const [isNativeAvailable, setIsNativeAvailable] = useState(false);

  useEffect(() => {
    const checkNativeCapabilities = async () => {
      const available = await NativeCameraService.isAvailable();
      setIsNativeAvailable(available);
      
      if (available) {
        // Request permissions on component mount
        await NativeCameraService.requestPermissions();
      }
    };

    checkNativeCapabilities();
  }, []);

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

  const handleNativeCamera = async () => {
    const capturedImage = await NativeCameraService.takePicture();
    if (capturedImage) {
      setImage(capturedImage);
      onImageChange(capturedImage);
    }
  };

  const handleNativeGallery = async () => {
    const selectedImage = await NativeCameraService.selectFromGallery();
    if (selectedImage) {
      setImage(selectedImage);
      onImageChange(selectedImage);
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
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-md transition-all active:scale-95"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {isNativeAvailable ? (
            /* Native camera controls */
            <div className="flex gap-3">
              <Button
                onClick={handleNativeCamera}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl"
              >
                <Camera className="w-6 h-6 mr-2" />
                Take Photo
              </Button>
              <Button
                onClick={handleNativeGallery}
                variant="outline"
                className="flex-1 py-6 rounded-xl border-2 border-dashed"
              >
                <ImageIcon className="w-6 h-6 mr-2" />
                Gallery
              </Button>
            </div>
          ) : (
            /* Web fallback */
            <label className="block aspect-square max-w-xs mx-auto border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors active:scale-95">
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
      )}
    </div>
  );
};
