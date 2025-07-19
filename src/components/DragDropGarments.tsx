
import { useState, useRef } from "react";
import { GarmentCard, GarmentData } from "./GarmentCard";

interface DragDropGarmentsProps {
  garments: GarmentData[];
  onReorder: (garments: GarmentData[]) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onQuickPreview: (garment: GarmentData) => void;
  viewMode: "grid" | "list";
}

export const DragDropGarments = ({
  garments,
  onReorder,
  onToggleFavorite,
  onDelete,
  onQuickPreview,
  viewMode,
}: DragDropGarmentsProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, garment: GarmentData) => {
    setDraggedItem(garment.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', garment.id);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/html');
    
    if (draggedId && draggedItem) {
      const draggedIndex = garments.findIndex(g => g.id === draggedId);
      if (draggedIndex !== -1) {
        const newGarments = [...garments];
        const [draggedGarment] = newGarments.splice(draggedIndex, 1);
        newGarments.splice(dropIndex, 0, draggedGarment);
        onReorder(newGarments);
      }
    }
    
    handleDragEnd();
  };

  return (
    <div className={`${
      viewMode === "grid" 
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
        : "space-y-3"
    }`}>
      {garments.map((garment, index) => (
        <div
          key={garment.id}
          draggable
          onDragStart={(e) => handleDragStart(e, garment)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onClick={() => onQuickPreview(garment)}
          className={`relative cursor-move transition-all duration-200 ${
            draggedItem === garment.id ? 'opacity-50 scale-95' : ''
          } ${
            dragOverIndex === index ? 'scale-105' : ''
          }`}
        >
          {dragOverIndex === index && (
            <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-xl bg-purple-50/50 z-10" />
          )}
          <GarmentCard
            garment={garment}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            size={viewMode === "grid" ? "medium" : "small"}
          />
        </div>
      ))}
    </div>
  );
};
