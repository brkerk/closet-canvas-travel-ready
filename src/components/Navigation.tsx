
import { Camera, Layout, Shirt, Sparkles, Scissors } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "capture", label: "Smart Capture", icon: Camera },
    { id: "closet", label: "My Closet", icon: Shirt },
    { id: "builder", label: "Closet Designer", icon: Layout },
    { id: "outfits", label: "Outfit AI", icon: Sparkles },
    { id: "tools", label: "AI Tools", icon: Scissors },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-pink-100 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === id
                  ? "bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
