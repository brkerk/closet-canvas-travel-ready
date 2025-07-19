import { GarmentPreview } from "@/utils/canvasUtils";

interface GarmentThumbnailProps {
  garment: GarmentPreview;
  size?: "sm" | "md" | "lg";
}

export const GarmentThumbnail = ({ garment, size = "md" }: GarmentThumbnailProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm", 
    lg: "w-12 h-12 text-base"
  };

  const getGarmentIcon = () => {
    const icons = {
      shirt: "👕",
      pants: "👖", 
      dress: "👗",
      jacket: "🧥",
      shoes: "👟",
      accessory: "👜"
    };
    return icons[garment.type] || "👕";
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-lg border-2 flex items-center justify-center shadow-sm backdrop-blur-sm relative ${
        garment.isAutoAssigned 
          ? 'border-green-400 bg-green-100/80' 
          : 'border-white/30'
      }`}
      style={{ 
        backgroundColor: garment.isAutoAssigned ? undefined : `${garment.color}aa`,
        borderColor: garment.isAutoAssigned ? '#4ade80' : garment.color
      }}
      title={`${garment.name}${garment.isAutoAssigned ? ' (Auto-assigned)' : ''}`}
    >
      <span className={`drop-shadow-sm ${garment.isAutoAssigned ? 'text-green-800' : 'text-white'}`}>
        {getGarmentIcon()}
      </span>
      
      {/* Auto-assignment indicator */}
      {garment.isAutoAssigned && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
          <span className="text-white text-xs font-bold">✓</span>
        </div>
      )}
    </div>
  );
};