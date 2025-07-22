
import { useState, useEffect } from "react";
import { MobileClosetBuilder } from "@/components/MobileClosetBuilder";
import { EnhancedGarmentCapture } from "@/components/EnhancedGarmentCapture";
import { GarmentCatalog } from "@/components/GarmentCatalog";
import { SmartOutfitRecommendations } from "@/components/SmartOutfitRecommendations";
import { NativeFeatures } from "@/services/nativeFeatures";
import { Camera, Shirt, Home, Sparkles, ArrowLeft, User } from "lucide-react";
import closetLogo from "@/assets/closety-logo.png";

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
      <div className="sticky top-0 z-10 bg-purple-50 shadow-sm px-4 py-2 pt-safe-area-inset-top">
        <div className="flex items-center justify-between">
          {/* Left: Back button or menu */}
          <div className="w-8">
            {activeTab !== "capture" && (
              <button 
                onClick={() => setActiveTab("capture")} 
                aria-label="Back"
              >
                <ArrowLeft size={20} className="text-purple-900" />
              </button>
            )}
          </div>
          
          {/* Center: Logo + Name + Subtitle */}
          <div className="flex items-center space-x-2 flex-1 justify-center">
            <img src={closetLogo} alt="Closety logo" className="w-6 h-6" />
            <h1 className="text-base font-normal text-purple-900">Closety</h1>
            <small className="text-xs text-gray-600">Smart wardrobe management</small>
          </div>
          
          {/* Right: User/Profile icon */}
          <div className="w-8 flex justify-end">
            <User size={20} className="text-purple-900" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
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
