
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface GarmentAnalysis {
  type: string;
  confidence: number;
  color: string;
  suggestedName: string;
  suggestedTags: string[];
}

class GarmentAIService {
  private imageClassifier: any = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.loadModels();
    return this.initPromise;
  }

  private async loadModels() {
    try {
      console.log('Loading AI models...');
      
      // Load image classification model
      this.imageClassifier = await pipeline(
        'image-classification',
        'microsoft/resnet-50',
        { device: 'webgpu' }
      );
      
      this.isInitialized = true;
      console.log('AI models loaded successfully');
    } catch (error) {
      console.error('Failed to load AI models:', error);
      throw error;
    }
  }

  async analyzeGarment(imageElement: HTMLImageElement): Promise<GarmentAnalysis> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Get image classification results
      const classifications = await this.imageClassifier(imageElement);
      console.log('Classification results:', classifications);

      // Extract dominant color from image
      const dominantColor = this.extractDominantColor(imageElement);

      // Map AI results to garment types
      const garmentType = this.mapToGarmentType(classifications);
      
      // Generate suggested name and tags
      const suggestedName = this.generateSuggestedName(garmentType, dominantColor);
      const suggestedTags = this.generateSuggestedTags(garmentType, classifications);

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

  private mapToGarmentType(classifications: any[]): { type: string; confidence: number } {
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

  private extractDominantColor(imageElement: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return 'Unknown';

    // Resize for faster processing
    canvas.width = 100;
    canvas.height = 100;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorCounts: Record<string, number> = {};
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip very dark or very light pixels (likely shadows/highlights)
      const brightness = (r + g + b) / 3;
      if (brightness < 50 || brightness > 200) continue;
      
      const colorName = this.rgbToColorName(r, g, b);
      colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
    }

    // Find most common color
    let dominantColor = 'Unknown';
    let maxCount = 0;
    
    for (const [color, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }

    return dominantColor;
  }

  private rgbToColorName(r: number, g: number, b: number): string {
    // Simple color mapping - could be enhanced with more sophisticated color matching
    const colors = [
      { name: 'Red', r: 255, g: 0, b: 0 },
      { name: 'Green', r: 0, g: 255, b: 0 },
      { name: 'Blue', r: 0, g: 0, b: 255 },
      { name: 'Yellow', r: 255, g: 255, b: 0 },
      { name: 'Orange', r: 255, g: 165, b: 0 },
      { name: 'Purple', r: 128, g: 0, b: 128 },
      { name: 'Pink', r: 255, g: 192, b: 203 },
      { name: 'Brown', r: 165, g: 42, b: 42 },
      { name: 'Black', r: 0, g: 0, b: 0 },
      { name: 'White', r: 255, g: 255, b: 255 },
      { name: 'Gray', r: 128, g: 128, b: 128 },
      { name: 'Navy', r: 0, g: 0, b: 128 },
      { name: 'Maroon', r: 128, g: 0, b: 0 },
      { name: 'Olive', r: 128, g: 128, b: 0 }
    ];

    let closestColor = 'Unknown';
    let minDistance = Infinity;

    for (const color of colors) {
      const distance = Math.sqrt(
        Math.pow(r - color.r, 2) + 
        Math.pow(g - color.g, 2) + 
        Math.pow(b - color.b, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color.name;
      }
    }

    return closestColor;
  }

  private generateSuggestedName(garmentType: string, color: string): string {
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

  private generateSuggestedTags(garmentType: string, classifications: any[]): string[] {
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

export const garmentAI = new GarmentAIService();
