
import { useState } from 'react';
import { garmentAI, GarmentAnalysis } from '@/services/garmentAI';

interface UseGarmentAnalysisReturn {
  analysis: GarmentAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeImage: (imageElement: HTMLImageElement) => Promise<void>;
  clearAnalysis: () => void;
}

export const useGarmentAnalysis = (): UseGarmentAnalysisReturn => {
  const [analysis, setAnalysis] = useState<GarmentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (imageElement: HTMLImageElement) => {
    try {
      setIsAnalyzing(true);
      setError(null);
      console.log('Starting garment analysis...');
      
      const result = await garmentAI.analyzeGarment(imageElement);
      setAnalysis(result);
      console.log('Analysis complete:', result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeImage,
    clearAnalysis
  };
};
