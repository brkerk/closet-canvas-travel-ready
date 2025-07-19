
import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  items: any[];
  selectedIndex: number;
  onSelectionChange: (index: number) => void;
  onSelect?: (item: any) => void;
  onBulkSelect?: () => void;
  isEnabled?: boolean;
}

export const useKeyboardNavigation = ({
  items,
  selectedIndex,
  onSelectionChange,
  onSelect,
  onBulkSelect,
  isEnabled = true,
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled || items.length === 0) return;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onSelectionChange(Math.max(0, selectedIndex - 1));
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        onSelectionChange(Math.min(items.length - 1, selectedIndex + 1));
        break;
      
      case 'ArrowLeft':
        event.preventDefault();
        const leftIndex = Math.max(0, selectedIndex - 5); // Grid navigation
        onSelectionChange(leftIndex);
        break;
      
      case 'ArrowRight':
        event.preventDefault();
        const rightIndex = Math.min(items.length - 1, selectedIndex + 5); // Grid navigation
        onSelectionChange(rightIndex);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (onSelect && items[selectedIndex]) {
          onSelect(items[selectedIndex]);
        }
        break;
      
      case ' ':
        event.preventDefault();
        if (onBulkSelect) {
          onBulkSelect();
        }
        break;
      
      case 'Escape':
        event.preventDefault();
        onSelectionChange(-1);
        break;
    }
  }, [items, selectedIndex, onSelectionChange, onSelect, onBulkSelect, isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isEnabled]);

  return {
    selectedIndex,
    isSelected: (index: number) => index === selectedIndex,
  };
};
