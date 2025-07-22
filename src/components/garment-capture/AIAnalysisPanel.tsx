
import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GarmentAnalysis } from "@/types/garment";

interface AIAnalysisPanelProps {
  analysis: GarmentAnalysis | null;
  onApply: () => void;
}

export const AIAnalysisPanel = ({ analysis, onApply }: AIAnalysisPanelProps) => {
  if (!analysis) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800 flex items-center gap-1.5 text-sm">
          <Sparkles className="w-4 h-4 text-purple-500" />
          AI Analysis
        </h3>
        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
          {Math.round(analysis.confidence * 100)}% confident
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-1 text-xs mb-3">
        <div><span className="text-gray-600">Type:</span> <span className="font-medium">{analysis.type}</span></div>
        <div><span className="text-gray-600">Color:</span> <span className="font-medium">{analysis.color}</span></div>
        <div><span className="text-gray-600">Name:</span> <span className="font-medium">{analysis.suggestedName}</span></div>
        <div><span className="text-gray-600">Tags:</span> <span className="font-medium">{analysis.suggestedTags.join(", ")}</span></div>
      </div>
      
      <Button
        type="button"
        onClick={onApply}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        size="sm"
      >
        Apply Suggestions
      </Button>
    </div>
  );
};
