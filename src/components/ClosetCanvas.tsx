
import { useRef, useCallback, useState, useEffect } from "react";
import { CanvasModule as CanvasModuleComponent } from "./CanvasModule";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CanvasModule, 
  CanvasPosition, 
  CanvasSize, 
  CANVAS_CONFIG
} from "@/utils/canvasUtils";

interface ClosetCanvasProps {
  modules: CanvasModule[];
  selectedModule: string | null;
  onModuleSelect: (moduleId: string | null) => void;
  onModuleMove: (moduleId: string, newPosition: CanvasPosition) => void;
  onModuleResize: (moduleId: string, newSize: CanvasSize) => void;
  onModuleRemove: (moduleId: string) => void;
  showAssignmentHighlights?: boolean;
  autoAssignments?: any[];
}

export const ClosetCanvas = ({
  modules,
  selectedModule,
  onModuleSelect,
  onModuleMove,
  onModuleResize,
  onModuleRemove,
  showAssignmentHighlights = false,
  autoAssignments = [],
}: ClosetCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Zoom and scale state
  const [scale, setScale] = useState(1);
  const [isZoomedToFit, setIsZoomedToFit] = useState(false);

  // Zoom-to-fit functionality
  const zoomToFit = useCallback(() => {
    if (!canvasRef.current || !wrapperRef.current) return;
    
    const wrapper = wrapperRef.current;
    const content = canvasRef.current;
    
    const wrapperRect = wrapper.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    
    // Calculate scale to fit content in wrapper
    const scaleX = (wrapperRect.width - 40) / contentRect.width;
    const scaleY = (wrapperRect.height - 40) / contentRect.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    setScale(newScale);
    setIsZoomedToFit(true);
    
    // Center the content
    wrapper.scrollLeft = (content.scrollWidth - wrapper.clientWidth) / 2;
    wrapper.scrollTop = (content.scrollHeight - wrapper.clientHeight) / 2;
  }, []);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setScale(1);
    setIsZoomedToFit(false);
  }, []);

  // Auto zoom-to-fit on mobile when modules change
  useEffect(() => {
    if (isMobile && modules.length > 0) {
      setTimeout(() => zoomToFit(), 100);
    }
  }, [modules.length, isMobile, zoomToFit]);

  // Enhanced pinch-to-zoom support for mobile
  useEffect(() => {
    if (!isMobile || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    let initialDistance = 0;
    let initialScale = scale;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const scaleChange = currentDistance / initialDistance;
        const newScale = Math.max(0.5, Math.min(3, initialScale * scaleChange));
        setScale(newScale);
        setIsZoomedToFit(false);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialDistance = 0;
      }
    };

    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Deselect when clicking on empty canvas
    if (e.target === canvasRef.current) {
      onModuleSelect(null);
    }
  }, [onModuleSelect]);

  // Calculate responsive canvas dimensions with proper sizing for scroll
  const getCanvasStyle = () => {
    const baseStyle = {
      backgroundColor: '#f5f5f5',
      backgroundImage: 'none',
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      transition: 'transform 0.2s ease-out',
    };

    if (isMobile) {
      return {
        ...baseStyle,
        width: '1200px',
        height: '600px',
        minWidth: '1200px',
        minHeight: '600px',
      };
    }
    
    return {
      ...baseStyle,
      width: CANVAS_CONFIG.width,
      height: CANVAS_CONFIG.height,
      minWidth: CANVAS_CONFIG.width,
      minHeight: CANVAS_CONFIG.height,
    };
  };

  return (
    <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-lg border border-gray-200">
      <div className="mb-2 sm:mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
              Closet Elevation View
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Blueprint-style 2D closet design - snap modules together to build your layout
            </p>
          </div>
          
          {/* Zoom Controls - Mobile only */}
          {isMobile && modules.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={zoomToFit}
                className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Zoom to fit"
              >
                🔍
              </button>
              <button
                onClick={resetZoom}
                className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Reset zoom"
              >
                1:1
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Canvas Wrapper with fixed height to prevent collapse */}
      <div
        ref={wrapperRef}
        className="w-full overflow-auto relative pointer-events-auto border-2 border-gray-300 rounded-lg"
        style={{
          height: isMobile ? '70vh' : '600px', // Fixed height prevents collapse
          minHeight: isMobile ? '400px' : '600px',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y', // Allow pan but prevent zoom
        }}
      >
        <div
          ref={canvasRef}
          className="relative"
          style={getCanvasStyle()}
          onMouseDown={handleMouseDown}
        >
          {/* Floor and Wall Lines - Responsive */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {(() => {
              const canvasHeight = isMobile ? 600 : CANVAS_CONFIG.height;
              const canvasWidth = isMobile ? 1200 : CANVAS_CONFIG.width;
              
              return (
                <>
                  {/* Floor line */}
                  <line 
                    x1="0" 
                    y1={canvasHeight - 20} 
                    x2={canvasWidth} 
                    y2={canvasHeight - 20}
                    stroke="rgba(0,0,0,0.3)" 
                    strokeWidth="2"
                  />
                  {/* Left wall */}
                  <line 
                    x1="20" 
                    y1="0" 
                    x2="20" 
                    y2={canvasHeight - 20}
                    stroke="rgba(0,0,0,0.3)" 
                    strokeWidth="2"
                  />
                  {/* Right wall */}
                  <line 
                    x1={canvasWidth - 20} 
                    y1="0" 
                    x2={canvasWidth - 20} 
                    y2={canvasHeight - 20}
                    stroke="rgba(0,0,0,0.3)" 
                    strokeWidth="2"
                  />
                  {/* Ceiling line */}
                  <line 
                    x1="20" 
                    y1="20" 
                    x2={canvasWidth - 20} 
                    y2="20"
                    stroke="rgba(0,0,0,0.2)" 
                    strokeWidth="1"
                  />
                </>
              );
            })()}
          </svg>

          {/* Canvas modules */}
          {modules.map((module) => (
            <CanvasModuleComponent
              key={module.id}
              module={module}
              isSelected={selectedModule === module.id}
              onSelect={() => onModuleSelect(module.id)}
              onRemove={() => onModuleRemove(module.id)}
              onUpdatePosition={(position) => onModuleMove(module.id, position)}
              onUpdateSize={(size) => onModuleResize(module.id, size)}
              allModules={modules}
            />
          ))}

          {/* Empty state - Mobile responsive */}
          {modules.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center text-gray-500 px-4">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">📐</div>
                <p className="text-sm sm:text-lg font-medium mb-1 sm:mb-2">Start Your Closet Design</p>
                <p className="text-xs sm:text-sm">Add modules to create your 2D closet elevation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Instructions */}
      {isMobile && modules.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          📱 Scroll to pan • 🤏 Pinch to zoom • 🔍 Tap zoom button to fit
        </div>
      )}
    </div>
  );
};
