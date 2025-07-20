
import React from 'react';

interface ModuleIllustrationProps {
  width?: number;
  height?: number;
  className?: string;
}

export const HangingRodIllustration = ({ width = 60, height = 80, className = "" }: ModuleIllustrationProps) => (
  <svg width={width} height={height} viewBox="0 0 60 80" className={className}>
    {/* Rod */}
    <rect x="5" y="10" width="50" height="3" fill="currentColor" opacity="0.8" rx="1.5" />
    
    {/* Hangers */}
    <g opacity="0.6">
      {/* Hanger 1 */}
      <path d="M15 13 Q15 15 17 15 L25 15 Q27 15 27 13" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="21" cy="13" r="1" fill="currentColor" />
      
      {/* Hanger 2 */}
      <path d="M25 13 Q25 15 27 15 L35 15 Q37 15 37 13" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="31" cy="13" r="1" fill="currentColor" />
      
      {/* Hanger 3 */}
      <path d="M35 13 Q35 15 37 15 L45 15 Q47 15 47 13" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="41" cy="13" r="1" fill="currentColor" />
    </g>
    
    {/* Hanging clothes silhouettes */}
    <g opacity="0.4">
      <rect x="17" y="15" width="8" height="25" fill="currentColor" rx="2" />
      <rect x="27" y="15" width="8" height="30" fill="currentColor" rx="2" />
      <rect x="37" y="15" width="8" height="28" fill="currentColor" rx="2" />
    </g>
  </svg>
);

export const ShelvesIllustration = ({ width = 60, height = 60, className = "" }: ModuleIllustrationProps) => (
  <svg width={width} height={height} viewBox="0 0 60 60" className={className}>
    {/* Shelf 1 */}
    <rect x="5" y="15" width="50" height="2" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Shelf 2 */}
    <rect x="5" y="30" width="50" height="2" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Shelf 3 */}
    <rect x="5" y="45" width="50" height="2" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Folded items on shelves */}
    <g opacity="0.5">
      {/* Top shelf items */}
      <rect x="8" y="10" width="12" height="5" fill="currentColor" rx="1" />
      <rect x="22" y="10" width="12" height="5" fill="currentColor" rx="1" />
      <rect x="36" y="10" width="12" height="5" fill="currentColor" rx="1" />
      
      {/* Middle shelf items */}
      <rect x="8" y="25" width="12" height="5" fill="currentColor" rx="1" />
      <rect x="22" y="25" width="12" height="5" fill="currentColor" rx="1" />
      <rect x="36" y="25" width="12" height="5" fill="currentColor" rx="1" />
      
      {/* Bottom shelf items */}
      <rect x="8" y="40" width="12" height="5" fill="currentColor" rx="1" />
      <rect x="22" y="40" width="12" height="5" fill="currentColor" rx="1" />
    </g>
  </svg>
);

export const DrawersIllustration = ({ width = 60, height = 50, className = "" }: ModuleIllustrationProps) => (
  <svg width={width} height={height} viewBox="0 0 60 50" className={className}>
    {/* Drawer 1 */}
    <rect x="5" y="5" width="50" height="12" fill="currentColor" opacity="0.3" rx="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    <rect x="45" y="9" width="6" height="4" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Drawer 2 */}
    <rect x="5" y="19" width="50" height="12" fill="currentColor" opacity="0.3" rx="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    <rect x="45" y="23" width="6" height="4" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Drawer 3 */}
    <rect x="5" y="33" width="50" height="12" fill="currentColor" opacity="0.3" rx="2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
    <rect x="45" y="37" width="6" height="4" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Small items inside (partially visible) */}
    <g opacity="0.4">
      <circle cx="15" cy="11" r="2" fill="currentColor" />
      <circle cx="25" cy="11" r="2" fill="currentColor" />
      <circle cx="35" cy="11" r="2" fill="currentColor" />
    </g>
  </svg>
);

export const ShoeRackIllustration = ({ width = 50, height = 70, className = "" }: ModuleIllustrationProps) => (
  <svg width={width} height={height} viewBox="0 0 50 70" className={className}>
    {/* Rack structure */}
    <rect x="5" y="20" width="40" height="2" fill="currentColor" opacity="0.8" rx="1" />
    <rect x="5" y="35" width="40" height="2" fill="currentColor" opacity="0.8" rx="1" />
    <rect x="5" y="50" width="40" height="2" fill="currentColor" opacity="0.8" rx="1" />
    
    {/* Shoes */}
    <g opacity="0.6">
      {/* Top row */}
      <ellipse cx="15" cy="17" rx="8" ry="3" fill="currentColor" />
      <ellipse cx="35" cy="17" rx="8" ry="3" fill="currentColor" />
      
      {/* Middle row */}
      <ellipse cx="15" cy="32" rx="8" ry="3" fill="currentColor" />
      <ellipse cx="35" cy="32" rx="8" ry="3" fill="currentColor" />
      
      {/* Bottom row */}
      <ellipse cx="15" cy="47" rx="8" ry="3" fill="currentColor" />
      <ellipse cx="35" cy="47" rx="8" ry="3" fill="currentColor" />
    </g>
    
    {/* Shoe details */}
    <g opacity="0.4">
      <path d="M12 15 Q15 14 18 15" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M32 15 Q35 14 38 15" stroke="currentColor" strokeWidth="1" fill="none" />
    </g>
  </svg>
);

export const AccessoryHooksIllustration = ({ width = 50, height = 50, className = "" }: ModuleIllustrationProps) => (
  <svg width={width} height={height} viewBox="0 0 50 50" className={className}>
    {/* Hooks */}
    <g opacity="0.8">
      <circle cx="15" cy="15" r="2" fill="currentColor" />
      <path d="M15 17 Q12 20 15 23" stroke="currentColor" strokeWidth="2" fill="none" />
      
      <circle cx="35" cy="15" r="2" fill="currentColor" />
      <path d="M35 17 Q32 20 35 23" stroke="currentColor" strokeWidth="2" fill="none" />
      
      <circle cx="25" cy="30" r="2" fill="currentColor" />
      <path d="M25 32 Q22 35 25 38" stroke="currentColor" strokeWidth="2" fill="none" />
    </g>
    
    {/* Hanging accessories */}
    <g opacity="0.5">
      {/* Belt */}
      <path d="M10 23 Q15 25 20 23" stroke="currentColor" strokeWidth="2" fill="none" />
      
      {/* Bag */}
      <rect x="30" y="23" width="10" height="8" fill="currentColor" rx="2" />
      <path d="M32 23 Q35 20 38 23" stroke="currentColor" strokeWidth="1" fill="none" />
      
      {/* Scarf */}
      <path d="M20 38 Q25 40 30 35" stroke="currentColor" strokeWidth="3" fill="none" />
    </g>
  </svg>
);
