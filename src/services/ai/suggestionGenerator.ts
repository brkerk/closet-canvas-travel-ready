
import type { Classification } from '@/types/garment';

export class SuggestionGeneratorService {
  generateSuggestedName(garmentType: string, color: string): string {
    const typeNames = {
      'Tops': ['Shirt', 'Blouse', 'Top', 'Tee', 'Sweater', 'Tank'],
      'Bottoms': ['Pants', 'Trousers', 'Jeans', 'Shorts', 'Leggings', 'Chinos'],
      'Outerwear': ['Jacket', 'Coat', 'Blazer', 'Cardigan', 'Hoodie', 'Vest'],
      'Dresses': ['Dress', 'Gown', 'Sundress', 'Maxi Dress', 'Mini Dress'],
      'Shoes': ['Shoes', 'Sneakers', 'Boots', 'Sandals', 'Heels', 'Flats'],
      'Accessories': ['Accessory', 'Belt', 'Bag', 'Scarf', 'Hat', 'Watch']
    };

    const names = typeNames[garmentType as keyof typeof typeNames] || ['Item'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    return color !== 'Unknown' ? `${color} ${randomName}` : randomName;
  }

  generateSuggestedTags(garmentType: string, classifications: Classification[]): string[] {
    const baseTags: string[] = [];
    
    // Enhanced type-based tags with more specificity
    const typeTags = {
      'Tops': ['casual', 'everyday', 'comfortable', 'versatile', 'wardrobe-staple'],
      'Bottoms': ['essential', 'basic', 'everyday', 'comfortable', 'versatile'],
      'Outerwear': ['layering', 'weather-protection', 'stylish', 'seasonal', 'functional'],
      'Dresses': ['elegant', 'feminine', 'occasion-wear', 'statement-piece', 'dressy'],
      'Shoes': ['footwear', 'comfortable', 'daily-wear', 'practical', 'essential'],
      'Accessories': ['accent-piece', 'finishing-touch', 'style-enhancer', 'statement', 'functional']
    };

    baseTags.push(...(typeTags[garmentType as keyof typeof typeTags] || ['clothing']));

    // Enhanced AI classification processing
    if (classifications && classifications.length > 0) {
      const topClassifications = classifications.slice(0, 3); // Use top 3 classifications
      
      for (const classification of topClassifications) {
        const label = classification.label.toLowerCase();
        
        // Extract and clean meaningful keywords
        const keywords = label.split(/[\s,.-]+/).filter(word => 
          word.length > 2 && 
          !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'].includes(word)
        );
        
        // Add contextual tags based on keywords
        keywords.forEach(keyword => {
          if (keyword.includes('formal') || keyword.includes('dress') || keyword.includes('suit')) {
            baseTags.push('formal');
          }
          if (keyword.includes('casual') || keyword.includes('jean') || keyword.includes('cotton')) {
            baseTags.push('casual');
          }
          if (keyword.includes('sport') || keyword.includes('athletic') || keyword.includes('gym')) {
            baseTags.push('athletic');
          }
          if (keyword.includes('winter') || keyword.includes('warm') || keyword.includes('coat')) {
            baseTags.push('winter');
          }
          if (keyword.includes('summer') || keyword.includes('light') || keyword.includes('shorts')) {
            baseTags.push('summer');
          }
        });
        
        // Add refined keywords as tags
        baseTags.push(...keywords.slice(0, 2));
      }
    }

    // Add smart seasonal/occasion tags based on type
    const seasonalTags = this.getSeasonalTags(garmentType);
    const occasionTags = this.getOccasionTags(garmentType);
    
    baseTags.push(...seasonalTags);
    baseTags.push(...occasionTags);

    // Remove duplicates, filter out generic words, and limit to 6 tags
    const uniqueTags = Array.from(new Set(baseTags))
      .filter(tag => tag.length > 2 && !['item', 'clothing', 'wear'].includes(tag))
      .slice(0, 6);
    
    return uniqueTags;
  }

  private getSeasonalTags(garmentType: string): string[] {
    const seasonalMappings = {
      'Outerwear': ['fall', 'winter'],
      'Tops': ['all-season'],
      'Bottoms': ['all-season'],
      'Dresses': ['spring', 'summer'],
      'Shoes': ['all-season'],
      'Accessories': ['all-season']
    };

    return seasonalMappings[garmentType as keyof typeof seasonalMappings] || [];
  }

  private getOccasionTags(garmentType: string): string[] {
    const occasionMappings = {
      'Outerwear': ['work', 'casual'],
      'Tops': ['work', 'casual', 'weekend'],
      'Bottoms': ['work', 'casual'],
      'Dresses': ['formal', 'special-occasion'],
      'Shoes': ['work', 'casual'],
      'Accessories': ['work', 'formal']
    };

    const occasions = occasionMappings[garmentType as keyof typeof occasionMappings] || ['casual'];
    return [occasions[Math.floor(Math.random() * occasions.length)]];
  }
}

export const suggestionGenerator = new SuggestionGeneratorService();
