
export interface GarmentAnalysis {
  type: string;
  confidence: number;
  color: string;
  suggestedName: string;
  suggestedTags: string[];
}

export interface GarmentTypeResult {
  type: string;
  confidence: number;
}

export interface Classification {
  label: string;
  score: number;
}
