
import { useState } from "react";
import { MobileClosetBuilder } from "@/components/MobileClosetBuilder";
import { EnhancedGarmentCapture } from "@/components/EnhancedGarmentCapture";
import { GarmentCatalog } from "@/components/GarmentCatalog";
import { SmartOutfitRecommendations } from "@/components/SmartOutfitRecommendations";
import { Camera, Shirt, Home, Sparkles } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "capture":
        return <EnhancedGarmentCapture />;
      case "closet":
        return <GarmentCatalog />;
      case "builder":
        return <MobileClosetBuilder />;
      case "outfits":
        return <SmartOutfitRecommendations />;
      default:
        return <EnhancedGarmentCapture />;
    }
  };

  const tabs = [
    { id: "capture", label: "Capture", icon: Camera },
    { id: "closet", label: "My Closet", icon: Shirt },
    { id: "builder", label: "Design", icon: Home },
    { id: "outfits", label: "Outfits", icon: Sparkles },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Digital Closet</h1>
        <p className="text-sm text-gray-600">Smart wardrobe management</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 py-1">
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
