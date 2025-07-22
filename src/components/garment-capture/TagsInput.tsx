
import React, { useState, useRef, KeyboardEvent } from "react";
import { X, Tag as TagIcon } from "lucide-react";

interface TagsInputProps {
  tags: string;
  onChange: (tags: string) => void;
}

export const TagsInput = ({ tags, onChange }: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const tagsArray = tags.split(",").filter(tag => tag.trim() !== "");
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === "" && tagsArray.length > 0) {
      removeTag(tagsArray.length - 1);
    }
  };

  const addTag = () => {
    if (inputValue.trim() !== "") {
      const newTags = [...tagsArray, inputValue.trim()].join(",");
      onChange(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tagsArray.filter((_, i) => i !== index).join(",");
    onChange(newTags);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
        <TagIcon className="w-3.5 h-3.5" />
        Tags
      </label>
      <div className="flex flex-wrap gap-1.5 p-2 bg-background border border-input rounded-lg focus-within:ring-1 focus-within:ring-ring min-h-[42px]">
        {tagsArray.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs"
          >
            <span>{tag.trim()}</span>
            <button 
              type="button" 
              onClick={() => removeTag(index)}
              className="text-purple-600 hover:text-purple-800"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-grow min-w-[120px] outline-none bg-transparent text-sm"
          placeholder={tagsArray.length === 0 ? "Add tags (press Enter or comma)" : ""}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
};
