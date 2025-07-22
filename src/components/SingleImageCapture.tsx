
import { useState, useEffect } from "react";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import { NativeCameraService } from "@/services/nativeCamera";
import { NativeFeatures } from "@/services/nativeFeatures";
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
    await NativeFeatures.vibrateMedium();
    const capturedImage = await NativeCameraService.takePicture();
    if (capturedImage) {
      setImage(capturedImage);
      onImageChange(capturedImage);
      await NativeFeatures.vibrateLight();
    }
  };

  const handleNativeGallery = async () => {
    await NativeFeatures.vibrateLight();
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
    <div>
      {image ? (
        <div className="relative">
          <img
            src={image.url}
            alt="Captured garment"
            className="w-full h-48 object-cover rounded-lg"
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
        <div>
          {isNativeAvailable ? (
            /* Native camera controls - simplified for uploader area */
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '140px' }}>
              <Camera size={48} style={{ color: 'hsl(var(--color-border))' }} />
              <span 
                style={{ 
                  display: 'block', 
                  marginTop: '8px', 
                  color: 'hsl(var(--color-text-body))',
                  textAlign: 'center'
                }}
              >
                Tap to take photo
              </span>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleNativeCamera}
                  size="sm"
                  style={{ background: 'hsl(var(--color-primary))' }}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Camera
                </Button>
                <Button
                  onClick={handleNativeGallery}
                  variant="outline"
                  size="sm"
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Gallery
                </Button>
              </div>
            </div>
          ) : (
            /* Web fallback */
            <label className="flex flex-col items-center justify-center cursor-pointer" style={{ minHeight: '140px' }}>
              <Camera size={48} style={{ color: 'hsl(var(--color-border))' }} />
              <span 
                style={{ 
                  display: 'block', 
                  marginTop: '8px', 
                  color: 'hsl(var(--color-text-body))',
                  textAlign: 'center'
                }}
              >
                Tap to take photo
              </span>
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
