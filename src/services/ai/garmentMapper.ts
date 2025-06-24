
import type { Classification, GarmentTypeResult } from '@/types/garment';

export class GarmentMapperService {
  mapToGarmentType(classifications: Classification[]): GarmentTypeResult {
    // Map common clothing-related classifications to our garment types
    const garmentMappings: Record<string, string> = {
      'jersey': 'Tops',
      'cardigan': 'Tops',
      'sweater': 'Tops',
      'sweatshirt': 'Tops',
      'polo shirt': 'Tops',
      'tank top': 'Tops',
      'tee shirt': 'Tops',
      'suit': 'Outerwear',
      'trench coat': 'Outerwear',
      'lab coat': 'Outerwear',
      'jean': 'Bottoms',
      'miniskirt': 'Bottoms',
      'sarong': 'Bottoms',
      'overskirt': 'Bottoms',
      'shoe': 'Shoes',
      'sandal': 'Shoes',
      'boot': 'Shoes',
      'loafer': 'Shoes',
      'running shoe': 'Shoes',
      'sneaker': 'Shoes',
      'dress': 'Dresses',
      'gown': 'Dresses',
      'wedding dress': 'Dresses',
      'abaya': 'Dresses'
    };

    // Find the best match
    for (const classification of classifications) {
      const label = classification.label.toLowerCase();
      for (const [keyword, garmentType] of Object.entries(garmentMappings)) {
        if (label.includes(keyword)) {
          return {
            type: garmentType,
            confidence: classification.score
          };
        }
      }
    }

    // Default fallback
    return {
      type: 'Tops',
      confidence: 0.3
    };
  }
}

export const garmentMapper = new GarmentMapperService();
