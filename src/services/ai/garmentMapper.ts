
import type { Classification, GarmentTypeResult } from '@/types/garment';

export class GarmentMapperService {
  private garmentMappings = {
    // Expanded and more accurate mappings
    'jersey': 'Tops',
    'sweatshirt': 'Tops',
    'cardigan': 'Tops',
    'sweater': 'Tops',
    'pullover': 'Tops',
    'hoodie': 'Tops',
    'blouse': 'Tops',
    'shirt': 'Tops',
    'tshirt': 'Tops',
    'tank': 'Tops',
    'suit': 'Outerwear',
    'blazer': 'Outerwear',
    'coat': 'Outerwear',
    'jacket': 'Outerwear',
    'vest': 'Outerwear',
    'parka': 'Outerwear',
    'windbreaker': 'Outerwear',
    'jean': 'Bottoms',
    'jeans': 'Bottoms',
    'pants': 'Bottoms',
    'trousers': 'Bottoms',
    'chinos': 'Bottoms',
    'leggings': 'Bottoms',
    'shorts': 'Bottoms',
    'miniskirt': 'Bottoms',
    'skirt': 'Bottoms',
    'dress': 'Dresses',
    'gown': 'Dresses',
    'sundress': 'Dresses',
    'maxi': 'Dresses',
    'mini': 'Dresses',
    'shoe': 'Shoes',
    'shoes': 'Shoes',
    'sandal': 'Shoes',
    'sandals': 'Shoes',
    'boot': 'Shoes',
    'boots': 'Shoes',
    'sneaker': 'Shoes',
    'sneakers': 'Shoes',
    'heels': 'Shoes',
    'flats': 'Shoes',
    'loafers': 'Shoes',
    'hat': 'Accessories',
    'cap': 'Accessories',
    'bag': 'Accessories',
    'purse': 'Accessories',
    'handbag': 'Accessories',
    'backpack': 'Accessories',
    'belt': 'Accessories',
    'tie': 'Accessories',
    'bowtie': 'Accessories',
    'scarf': 'Accessories',
    'gloves': 'Accessories',
    'watch': 'Accessories',
    'jewelry': 'Accessories',
    'necklace': 'Accessories',
    'bracelet': 'Accessories',
    'sunglasses': 'Accessories',
  };

  mapToGarmentType(classifications: Classification[]): GarmentTypeResult {
    if (!classifications || classifications.length === 0) {
      return { type: 'Tops', confidence: 0 };
    }

    // Find the best matching garment type with improved scoring
    let bestMatch: GarmentTypeResult = { type: 'Tops', confidence: 0 };
    const typeScores: { [key: string]: number } = {};

    for (const classification of classifications) {
      const label = classification.label.toLowerCase();
      const score = classification.score;
      
      // Check for direct matches with confidence boosting
      for (const [keyword, garmentType] of Object.entries(this.garmentMappings)) {
        if (label.includes(keyword)) {
          // Boost confidence for exact matches
          const confidenceBoost = label === keyword ? 1.2 : 1.0;
          const adjustedScore = score * confidenceBoost;
          
          if (!typeScores[garmentType] || typeScores[garmentType] < adjustedScore) {
            typeScores[garmentType] = adjustedScore;
          }
        }
      }

      // Additional context-based scoring
      this.applyContextualScoring(label, score, typeScores);
    }

    // Find the highest scoring type
    for (const [type, score] of Object.entries(typeScores)) {
      if (score > bestMatch.confidence) {
        bestMatch = { type, confidence: score };
      }
    }

    // Fallback with improved heuristics
    if (bestMatch.confidence === 0) {
      bestMatch = this.fallbackClassification(classifications[0]);
    }

    // Ensure confidence is within reasonable bounds
    bestMatch.confidence = Math.min(bestMatch.confidence, 1.0);

    return bestMatch;
  }

  private applyContextualScoring(label: string, score: number, typeScores: { [key: string]: number }) {
    // Apply contextual rules for better classification
    if (label.includes('clothing') || label.includes('apparel')) {
      // Generic clothing terms get distributed based on common patterns
      if (label.includes('upper') || label.includes('top')) {
        typeScores['Tops'] = Math.max(typeScores['Tops'] || 0, score * 0.7);
      } else if (label.includes('lower') || label.includes('bottom')) {
        typeScores['Bottoms'] = Math.max(typeScores['Bottoms'] || 0, score * 0.7);
      } else if (label.includes('outer') || label.includes('cover')) {
        typeScores['Outerwear'] = Math.max(typeScores['Outerwear'] || 0, score * 0.7);
      }
    }

    // Material-based hints
    if (label.includes('denim')) {
      typeScores['Bottoms'] = Math.max(typeScores['Bottoms'] || 0, score * 0.8);
    }
    if (label.includes('leather') && (label.includes('shoe') || label.includes('boot'))) {
      typeScores['Shoes'] = Math.max(typeScores['Shoes'] || 0, score * 0.9);
    }
    if (label.includes('wool') && (label.includes('coat') || label.includes('sweater'))) {
      const type = label.includes('coat') ? 'Outerwear' : 'Tops';
      typeScores[type] = Math.max(typeScores[type] || 0, score * 0.8);
    }
  }

  private fallbackClassification(topClassification: Classification): GarmentTypeResult {
    const label = topClassification.label.toLowerCase();
    
    // Enhanced fallback logic
    if (label.includes('wear') || label.includes('clothing') || label.includes('textile')) {
      // Try to infer from position or context
      if (label.includes('head') || label.includes('face')) {
        return { type: 'Accessories', confidence: topClassification.score * 0.6 };
      }
      if (label.includes('foot') || label.includes('feet')) {
        return { type: 'Shoes', confidence: topClassification.score * 0.6 };
      }
      if (label.includes('hand') || label.includes('arm')) {
        return { type: 'Accessories', confidence: topClassification.score * 0.5 };
      }
      if (label.includes('body') || label.includes('torso')) {
        return { type: 'Tops', confidence: topClassification.score * 0.5 };
      }
    }

    // Default fallback
    return { type: 'Tops', confidence: topClassification.score * 0.3 };
  }
}

export const garmentMapper = new GarmentMapperService();
