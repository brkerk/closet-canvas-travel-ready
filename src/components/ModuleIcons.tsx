
import React from 'react';
import { 
  HangingRodIllustration, 
  ShelvesIllustration, 
  DrawersIllustration, 
  ShoeRackIllustration, 
  AccessoryHooksIllustration 
} from './ModuleIllustrations';

interface ModuleIconProps {
  type: "hanging-rod" | "shelves" | "drawers" | "shoe-rack" | "accessory-hooks";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ModuleIcon = ({ type, size = "md", className = "" }: ModuleIconProps) => {
  const sizeMap = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 }
  };

  const { width, height } = sizeMap[size];

  const iconProps = {
    width,
    height,
    className: `text-current ${className}`
  };

  switch (type) {
    case "hanging-rod":
      return <HangingRodIllustration {...iconProps} height={Math.round(height * 1.2)} />;
    case "shelves":
      return <ShelvesIllustration {...iconProps} />;
    case "drawers":
      return <DrawersIllustration {...iconProps} height={Math.round(height * 0.8)} />;
    case "shoe-rack":
      return <ShoeRackIllustration {...iconProps} width={Math.round(width * 0.8)} height={Math.round(height * 1.2)} />;
    case "accessory-hooks":
      return <AccessoryHooksIllustration {...iconProps} />;
    default:
      return null;
  }
};

export const ModulePreview = ({ type, className = "" }: { type: "hanging-rod" | "shelves" | "drawers" | "shoe-rack" | "accessory-hooks"; className?: string }) => {
  const previewSizes = {
    "hanging-rod": { width: 80, height: 100 },
    "shelves": { width: 80, height: 60 },
    "drawers": { width: 80, height: 50 },
    "shoe-rack": { width: 60, height: 80 },
    "accessory-hooks": { width: 60, height: 50 }
  };

  const { width, height } = previewSizes[type];

  const iconProps = {
    width,
    height,
    className: `text-current ${className}`
  };

  switch (type) {
    case "hanging-rod":
      return <HangingRodIllustration {...iconProps} />;
    case "shelves":
      return <ShelvesIllustration {...iconProps} />;
    case "drawers":
      return <DrawersIllustration {...iconProps} />;
    case "shoe-rack":
      return <ShoeRackIllustration {...iconProps} />;
    case "accessory-hooks":
      return <AccessoryHooksIllustration {...iconProps} />;
    default:
      return null;
  }
};
