
import { useState } from "react";
import { X, Heart, Calendar, Tag, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GarmentData } from "./GarmentCard";

interface QuickPreviewProps {
  garment: GarmentData | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (garment: GarmentData) => void;
  onDelete?: (id: string) => void;
}

export const QuickPreview = ({
  garment,
  isOpen,
  onClose,
  onToggleFavorite,
  onEdit,
  onDelete,
}: QuickPreviewProps) => {
  if (!isOpen || !garment) return null;

  const mockWearData = {
    timesWorn: Math.floor(Math.random() * 20) + 1,
    lastWorn: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    frequency: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Quick Preview</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Image */}
        <div className="aspect-square bg-gray-100 relative">
          {garment.imageUrl ? (
            <img
              src={garment.imageUrl}
              alt={garment.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">👕</span>
            </div>
          )}
          
          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(garment.id)}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                garment.isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart className="w-5 h-5" fill={garment.isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              {garment.name}
            </h3>
            {garment.brand && (
              <p className="text-gray-600 mb-2">{garment.brand}</p>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: garment.color.toLowerCase() }}
                />
                <span className="text-sm text-gray-600">{garment.color}</span>
              </div>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-600">{garment.type}</span>
            </div>
          </div>

          {/* Tags */}
          {garment.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {garment.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Wear Statistics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Wear Statistics
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Times worn:</span>
                <span className="text-sm font-medium">{mockWearData.timesWorn}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last worn:</span>
                <span className="text-sm font-medium">
                  {mockWearData.lastWorn.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Frequency:</span>
                <span className={`text-sm font-medium capitalize ${
                  mockWearData.frequency === 'high' ? 'text-green-600' :
                  mockWearData.frequency === 'medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {mockWearData.frequency}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(garment)}
                className="flex-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(garment.id)}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
