
import type { Classification, GarmentTypeResult } from '@/types/garment';

export class GarmentMapperService {
  private garmentMappings = {
    // ImageNet classes to garment types
    'jersey': 'Tops',
    'sweatshirt': 'Tops',
    'cardigan': 'Tops',
    'suit': 'Outerwear',
    'jean': 'Bottoms',
    'miniskirt': 'Bottoms',
    'shoe': 'Shoes',
    'sandal': 'Shoes',
    'boot': 'Shoes',
    'sneaker': 'Shoes',
    'dress': 'Dresses',
    'coat': 'Outerwear',
    'jacket': 'Outerwear',
    'shirt': 'Tops',
    'pants': 'Bottoms',
    'skirt': 'Bottoms',
    'shorts': 'Bottoms',
    'hat': 'Accessories',
    'bag': 'Accessories',
    'purse': 'Accessories',
    'belt': 'Accessories',
    'tie': 'Accessories',
    'scarf': 'Accessories',
  };

  mapToGarmentType(classifications: Classification[]): GarmentTypeResult {
    if (!classifications || classifications.length === 0) {
      return { type: 'Tops', confidence: 0 };
    }

    // Find the best matching garment type
    let bestMatch: GarmentTypeResult = { type: 'Tops', confidence: 0 };

    for (const classification of classifications) {
      const label = classification.label.toLowerCase();
      
      // Check for direct matches
      for (const [keyword, garmentType] of Object.entries(this.garmentMappings)) {
        if (label.includes(keyword)) {
          if (classification.score > bestMatch.confidence) {
            bestMatch = {
              type: garmentType,
              confidence: classification.score
            };
          }
        }
      }
    }

    // Fallback: use heuristics based on common clothing terms
    if (bestMatch.confidence === 0) {
      const topMatch = classifications[0];
      if (topMatch) {
        const label = topMatch.label.toLowerCase();
        
        if (label.includes('clothing') || label.includes('wear') || label.includes('textile')) {
          bestMatch = { type: 'Tops', confidence: topMatch.score * 0.5 };
        }
      }
    }

    return bestMatch;
  }
}

export const garmentMapper = new GarmentMapperService();
