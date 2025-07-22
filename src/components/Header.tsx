
import { Menu, Search, User, Settings } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">👔</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">Closety</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Your smart wardrobe companion</p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden border-t border-border py-3">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
                <span className="text-xs">Search</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-xs">Settings</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors">
                <User className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
