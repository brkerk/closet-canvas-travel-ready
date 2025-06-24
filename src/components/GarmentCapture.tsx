
import { useState } from "react";
import { Camera } from "lucide-react";

export const GarmentCapture = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [garmentData, setGarmentData] = useState({
    name: "",
    brand: "",
    color: "",
    type: "Tops",
    tags: "",
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setGarmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving garment:", garmentData);
    // Here you would save to your backend/database
    alert("Garment saved successfully!");
    
    // Reset form
    setSelectedImage(null);
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
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    Change Photo
                  </button>
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

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">📸 Photo Tips</h3>
        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
          <li>• Use good lighting for clear photos</li>
          <li>• Lay garments flat or hang them neatly</li>
          <li>• Include the full garment in the frame</li>
          <li>• Use a neutral background when possible</li>
        </ul>
      </div>
    </div>
  );
};
