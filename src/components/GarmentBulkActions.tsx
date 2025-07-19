
import { useState } from "react";
import { Trash2, Tag, Archive, Star, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GarmentBulkActionsProps {
  selectedItems: string[];
  onBulkDelete: (ids: string[]) => void;
  onBulkTag: (ids: string[], tags: string[]) => void;
  onBulkFavorite: (ids: string[]) => void;
  onClearSelection: () => void;
}

export const GarmentBulkActions = ({
  selectedItems,
  onBulkDelete,
  onBulkTag,
  onBulkFavorite,
  onClearSelection,
}: GarmentBulkActionsProps) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const handleBulkTag = () => {
    if (tagInput.trim()) {
      const tags = tagInput.split(",").map(tag => tag.trim());
      onBulkTag(selectedItems, tags);
      setTagInput("");
      setShowTagInput(false);
    }
  };

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium">
            {selectedItems.length} selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkFavorite(selectedItems)}
          >
            <Star className="w-4 h-4 mr-1" />
            Favorite
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="w-4 h-4 mr-1" />
                Tag
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Enter tags (comma-separated)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleBulkTag()}
                />
                <Button
                  size="sm"
                  onClick={handleBulkTag}
                  className="w-full mt-2"
                >
                  Apply Tags
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkDelete(selectedItems)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
