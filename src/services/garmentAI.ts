
import type { GarmentAnalysis } from '@/types/garment';
import { imageClassifier } from './ai/imageClassifier';
import { colorAnalyzer } from './ai/colorAnalyzer';
import { garmentMapper } from './ai/garmentMapper';
import { suggestionGenerator } from './ai/suggestionGenerator';

class GarmentAIService {
  async analyzeGarment(imageElement: HTMLImageElement): Promise<GarmentAnalysis> {
    try {
      // Get image classification results
      const classifications = await imageClassifier.classify(imageElement);
      console.log('Classification results:', classifications);

      // Extract dominant color from image
      const dominantColor = colorAnalyzer.extractDominantColor(imageElement);

      // Map AI results to garment types
      const garmentType = garmentMapper.mapToGarmentType(classifications);
      
      // Generate suggested name and tags
      const suggestedName = suggestionGenerator.generateSuggestedName(garmentType.type, dominantColor);
      const suggestedTags = suggestionGenerator.generateSuggestedTags(garmentType.type, classifications);

      return {
        type: garmentType.type,
        confidence: garmentType.confidence,
        color: dominantColor,
        suggestedName,
        suggestedTags
      };
    } catch (error) {
      console.error('Error analyzing garment:', error);
      throw error;
    }
  }
}

export const garmentAI = new GarmentAIService();
export type { GarmentAnalysis } from '@/types/garment';
