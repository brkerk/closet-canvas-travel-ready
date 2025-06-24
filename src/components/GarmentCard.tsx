
import { useState } from "react";
import { Heart, MoreVertical, Tag } from "lucide-react";

export interface GarmentData {
  id: string;
  name: string;
  brand?: string;
  color: string;
  type: string;
  tags: string[];
  imageUrl?: string;
  isFavorite?: boolean;
  lastWorn?: Date;
}

interface GarmentCardProps {
  garment: GarmentData;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (garment: GarmentData) => void;
  onDelete?: (id: string) => void;
  size?: "small" | "medium" | "large";
}

export const GarmentCard = ({ 
  garment, 
  onToggleFavorite, 
  onEdit, 
  onDelete,
  size = "medium" 
}: GarmentCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const sizeClasses = {
    small: "w-24 h-32",
    medium: "w-32 h-40 sm:w-36 sm:h-44",
    large: "w-40 h-52 sm:w-48 sm:h-60",
  };

  const imageSizes = {
    small: "h-20",
    medium: "h-24 sm:h-28",
    large: "h-36 sm:h-40",
  };

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-200`}>
      {/* Image */}
      <div className={`${imageSizes[size]} bg-gray-100 relative overflow-hidden`}>
        {garment.imageUrl ? (
          <img
            src={garment.imageUrl}
            alt={garment.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-2xl">👕</span>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(garment.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                garment.isFavorite 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart className="w-3 h-3" fill={garment.isFavorite ? "currentColor" : "none"} />
            </button>
          )}
          
          {(onEdit || onDelete) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <MoreVertical className="w-3 h-3 text-gray-600" />
              </button>
              
              {showMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-24">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(garment);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-1 text-left text-sm hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(garment.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-1 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col h-full">
        <h4 className="font-medium text-gray-800 text-xs sm:text-sm line-clamp-2 mb-1">
          {garment.name}
        </h4>
        
        {garment.brand && (
          <p className="text-xs text-gray-500 mb-1">{garment.brand}</p>
        )}
        
        <div className="flex items-center gap-1 mb-2">
          <div
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: garment.color.toLowerCase() }}
          />
          <span className="text-xs text-gray-600">{garment.color}</span>
        </div>

        {garment.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-auto">
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 truncate">
              {garment.tags.slice(0, 2).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
