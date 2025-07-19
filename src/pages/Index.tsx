
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Header } from "@/components/Header";
import { EnhancedGarmentCapture } from "@/components/EnhancedGarmentCapture";
import { GarmentCatalog } from "@/components/GarmentCatalog";
import { CanvasClosetBuilder } from "@/components/CanvasClosetBuilder";
import { SmartOutfitRecommendations } from "@/components/SmartOutfitRecommendations";
import { BackgroundRemovalTool } from "@/components/BackgroundRemovalTool";

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "capture":
        return <EnhancedGarmentCapture />;
      case "closet":
        return <GarmentCatalog />;
      case "builder":
        return <CanvasClosetBuilder />;
      case "outfits":
        return <SmartOutfitRecommendations />;
      case "tools":
        return <BackgroundRemovalTool />;
      default:
        return <EnhancedGarmentCapture />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Index;
