
import { useState } from "react";
import { Upload, Scissors, Download, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackgroundRemover } from "@/hooks/useBackgroundRemover";

export const BackgroundRemovalTool = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const { isProcessing, error, processedImage, removeBackgroundFromFile, clearProcessedImage } = useBackgroundRemover();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show original image
      setOriginalImage(URL.createObjectURL(file));
      
      // Process the image
      await removeBackgroundFromFile(file);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'background-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClear = () => {
    if (originalImage) {
      URL.revokeObjectURL(originalImage);
      setOriginalImage(null);
    }
    clearProcessedImage();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-purple-500" />
            Background Removal Tool
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Remove backgrounds from your garment photos using AI
          </p>
        </div>
        {(originalImage || processedImage) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {!originalImage ? (
        // Upload Area
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">Upload Garment Photo</h4>
            <p className="text-sm text-gray-500 mb-4">
              Choose a clear photo of your garment for best results
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
              Select Image
            </Button>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      ) : (
        // Processing & Results Area
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Original</h4>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Processed Image */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Background Removed</h4>
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative">
                {isProcessing ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-600">Processing...</p>
                      <p className="text-xs text-gray-500">This may take a few moments</p>
                    </div>
                  </div>
                ) : processedImage ? (
                  <img
                    src={processedImage}
                    alt="Background Removed"
                    className="w-full h-full object-cover"
                  />
                ) : error ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-red-600">
                      <X className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Processing Failed</p>
                      <p className="text-xs">{error}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Actions */}
          {processedImage && (
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Result
              </Button>
              <label>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Try Another Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Tips for Best Results</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Use clear, well-lit photos with good contrast</p>
          <p>• Avoid busy or cluttered backgrounds</p>
          <p>• Ensure the garment fills most of the frame</p>
          <p>• Processing works best with solid-colored backgrounds</p>
        </div>
      </div>
    </div>
  );
};
