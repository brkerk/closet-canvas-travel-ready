
import type { Classification } from '@/types/garment';

export class SuggestionGeneratorService {
  generateSuggestedName(garmentType: string, color: string): string {
    const typeNames: Record<string, string[]> = {
      'Tops': ['T-Shirt', 'Blouse', 'Shirt', 'Tank Top', 'Sweater'],
      'Bottoms': ['Jeans', 'Pants', 'Shorts', 'Skirt', 'Trousers'],
      'Outerwear': ['Jacket', 'Coat', 'Blazer', 'Cardigan', 'Hoodie'],
      'Dresses': ['Dress', 'Gown', 'Sundress', 'Maxi Dress'],
      'Shoes': ['Sneakers', 'Boots', 'Sandals', 'Heels', 'Flats'],
      'Accessories': ['Scarf', 'Belt', 'Hat', 'Bag', 'Jewelry']
    };

    const typeOptions = typeNames[garmentType] || ['Item'];
    const randomType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    
    return color !== 'Unknown' ? `${color} ${randomType}` : randomType;
  }

  generateSuggestedTags(garmentType: string, classifications: Classification[]): string[] {
    const tags = new Set<string>();
    
    // Add type-based tags
    const typeTags: Record<string, string[]> = {
      'Tops': ['casual', 'everyday'],
      'Bottoms': ['comfort', 'versatile'],
      'Outerwear': ['layering', 'weather'],
      'Dresses': ['formal', 'occasion'],
      'Shoes': ['footwear', 'comfort'],
      'Accessories': ['accent', 'style']
    };

    const typeSpecificTags = typeTags[garmentType] || [];
    typeSpecificTags.forEach(tag => tags.add(tag));

    // Add classification-based tags
    classifications.slice(0, 2).forEach(classification => {
      const label = classification.label.toLowerCase();
      if (label.includes('formal') || label.includes('suit')) {
        tags.add('formal');
      }
      if (label.includes('casual') || label.includes('jean')) {
        tags.add('casual');
      }
      if (label.includes('sport') || label.includes('athletic')) {
        tags.add('athletic');
      }
    });

    return Array.from(tags);
  }
}

export const suggestionGenerator = new SuggestionGeneratorService();
