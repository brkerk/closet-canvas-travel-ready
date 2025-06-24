
import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { GarmentCatalog } from "@/components/GarmentCatalog";
import { ClosetLayout } from "@/components/ClosetLayout";
import { OutfitRecommendations } from "@/components/OutfitRecommendations";
import { GarmentCapture } from "@/components/GarmentCapture";

type ActiveTab = "catalog" | "closet" | "outfits" | "capture";

const Index = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("closet");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "catalog":
        return <GarmentCatalog />;
      case "closet":
        return <ClosetLayout />;
      case "outfits":
        return <OutfitRecommendations />;
      case "capture":
        return <GarmentCapture />;
      default:
        return <ClosetLayout />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-4 sm:mt-6">
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
