
import { useState, useEffect } from "react";
import { MobileClosetBuilder } from "@/components/MobileClosetBuilder";
import { EnhancedGarmentCapture } from "@/components/EnhancedGarmentCapture";
import { GarmentCatalog } from "@/components/GarmentCatalog";
import { SmartOutfitRecommendations } from "@/components/SmartOutfitRecommendations";
import { NativeFeatures } from "@/services/nativeFeatures";
import { Camera, Shirt, Home, Sparkles } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Initialize native features and detect environment
    const initializeApp = async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        const nativePlatform = Capacitor.isNativePlatform();
        setIsNative(nativePlatform);
        
        // Initialize native features if on native platform
        if (nativePlatform) {
          await NativeFeatures.initialize();
        }
      } catch (error) {
        console.log('Not running in native environment');
      }
    };

    initializeApp();
  }, []);

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
    <div className={`h-screen flex flex-col bg-gray-50 ${isNative ? 'pt-safe-area-inset-top' : ''}`}>
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Digital Closet</h1>
            <p className="text-sm text-gray-600">Smart wardrobe management</p>
          </div>
          {isNative && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Native App" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </div>

      {/* Mobile Bottom Navigation with iOS-style design */}
      <div className={`bg-white/95 backdrop-blur-md border-t border-gray-200/50 px-2 py-1 ${isNative ? 'pb-safe-area-inset-bottom' : ''}`}>
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={async () => {
                // Add haptic feedback for native apps
                if (isNative) {
                  await NativeFeatures.vibrateLight();
                }
                setActiveTab(id);
              }}
              className={`flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-200 ${
                activeTab === id
                  ? "bg-blue-50 text-blue-600 scale-105"
                  : "text-gray-600 hover:text-gray-800 active:scale-95"
              }`}
            >
              <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
              <span className={`text-xs mt-1 font-medium ${activeTab === id ? 'font-semibold' : ''}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
