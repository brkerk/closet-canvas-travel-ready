
import type { Classification } from '@/types/garment';

export class SuggestionGeneratorService {
  generateSuggestedName(garmentType: string, color: string): string {
    const typeNames = {
      'Tops': ['Shirt', 'Blouse', 'Top', 'Tee'],
      'Bottoms': ['Pants', 'Trousers', 'Jeans', 'Shorts'],
      'Outerwear': ['Jacket', 'Coat', 'Blazer', 'Cardigan'],
      'Dresses': ['Dress', 'Gown', 'Sundress'],
      'Shoes': ['Shoes', 'Sneakers', 'Boots', 'Sandals'],
      'Accessories': ['Accessory', 'Belt', 'Bag', 'Scarf']
    };

    const names = typeNames[garmentType as keyof typeof typeNames] || ['Item'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    return color !== 'Unknown' ? `${color} ${randomName}` : randomName;
  }

  generateSuggestedTags(garmentType: string, classifications: Classification[]): string[] {
    const baseTags: string[] = [];
    
    // Add type-based tags
    const typeTags = {
      'Tops': ['casual', 'everyday', 'comfortable'],
      'Bottoms': ['versatile', 'essential', 'basic'],
      'Outerwear': ['layering', 'weather', 'stylish'],
      'Dresses': ['elegant', 'feminine', 'occasion'],
      'Shoes': ['footwear', 'comfortable', 'daily'],
      'Accessories': ['accent', 'finishing-touch', 'style']
    };

    baseTags.push(...(typeTags[garmentType as keyof typeof typeTags] || ['clothing']));

    // Add tags based on AI classifications
    if (classifications && classifications.length > 0) {
      const topClassification = classifications[0];
      const label = topClassification.label.toLowerCase();
      
      // Extract meaningful keywords from the classification
      const keywords = label.split(/[\s,.-]+/).filter(word => 
        word.length > 2 && 
        !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word)
      );
      
      // Add up to 2 keywords as tags
      baseTags.push(...keywords.slice(0, 2));
    }

    // Add seasonal/occasion tags
    const occasionTags = ['work', 'casual', 'formal', 'weekend'];
    baseTags.push(occasionTags[Math.floor(Math.random() * occasionTags.length)]);

    // Remove duplicates and limit to 5 tags
    const uniqueTags = Array.from(new Set(baseTags));
    return uniqueTags.slice(0, 5);
  }
}

export const suggestionGenerator = new SuggestionGeneratorService();
