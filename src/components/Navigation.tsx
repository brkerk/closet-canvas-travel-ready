
import { Camera, Folder, Image, List } from "lucide-react";

type ActiveTab = "catalog" | "closet" | "outfits" | "capture";

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: "catalog" as const, label: "Catalog", icon: Folder },
    { id: "closet" as const, label: "Closet", icon: List },
    { id: "outfits" as const, label: "Outfits", icon: Image },
    { id: "capture" as const, label: "Capture", icon: Camera },
  ];

  return (
    <nav className="bg-white rounded-2xl p-2 shadow-lg border border-pink-100">
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
