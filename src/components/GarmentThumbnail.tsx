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
      className={`${sizeClasses[size]} rounded-lg border-2 border-white/30 flex items-center justify-center shadow-sm backdrop-blur-sm`}
      style={{ 
        backgroundColor: `${garment.color}aa`,
        borderColor: garment.color
      }}
      title={garment.name}
    >
      <span className="text-white drop-shadow-sm">
        {getGarmentIcon()}
      </span>
    </div>
  );
};