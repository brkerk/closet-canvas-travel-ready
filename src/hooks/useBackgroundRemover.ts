
import { useState } from 'react';
import { removeBackground, loadImage } from '@/services/backgroundRemover';

interface UseBackgroundRemoverReturn {
  isProcessing: boolean;
  error: string | null;
  processedImage: string | null;
  removeBackgroundFromFile: (file: File) => Promise<void>;
  clearProcessedImage: () => void;
}

export const useBackgroundRemover = (): UseBackgroundRemoverReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const removeBackgroundFromFile = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log('Starting background removal for file:', file.name);
      
      // Load the image
      const imageElement = await loadImage(file);
      
      // Remove background
      const processedBlob = await removeBackground(imageElement);
      
      // Create URL for the processed image
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImage(processedUrl);
      
      console.log('Background removal completed successfully');
    } catch (err) {
      console.error('Background removal failed:', err);
      setError(err instanceof Error ? err.message : 'Background removal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearProcessedImage = () => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
      setProcessedImage(null);
    }
    setError(null);
  };

  return {
    isProcessing,
    error,
    processedImage,
    removeBackgroundFromFile,
    clearProcessedImage
  };
};
