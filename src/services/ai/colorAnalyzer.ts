
export class ColorAnalyzerService {
  extractDominantColor(imageElement: HTMLImageElement): string {
    try {
      // Create a canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.warn('Could not get canvas context for color analysis');
        return 'Unknown';
      }

      // Set canvas size to a smaller version for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / imageElement.naturalWidth, maxSize / imageElement.naturalHeight);
      canvas.width = imageElement.naturalWidth * scale;
      canvas.height = imageElement.naturalHeight * scale;
      
      // Draw the image
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Color frequency map
      const colorMap = new Map<string, number>();
      
      // Sample every few pixels for performance
      for (let i = 0; i < data.length; i += 16) { // Skip some pixels
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Quantize colors to reduce noise
        const quantizedR = Math.round(r / 32) * 32;
        const quantizedG = Math.round(g / 32) * 32;
        const quantizedB = Math.round(b / 32) * 32;
        
        const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
        colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
      }
      
      // Find the most frequent color
      let dominantColor = 'Unknown';
      let maxCount = 0;
      
      for (const [color, count] of colorMap.entries()) {
        if (count > maxCount) {
          maxCount = count;
          const [r, g, b] = color.split(',').map(Number);
          dominantColor = this.rgbToColorName(r, g, b);
        }
      }
      
      return dominantColor;
    } catch (error) {
      console.error('Error extracting dominant color:', error);
      return 'Unknown';
    }
  }

  private rgbToColorName(r: number, g: number, b: number): string {
    // Simple color name mapping based on RGB values
    const colors = [
      { name: 'Black', r: 0, g: 0, b: 0 },
      { name: 'White', r: 255, g: 255, b: 255 },
      { name: 'Red', r: 255, g: 0, b: 0 },
      { name: 'Green', r: 0, g: 255, b: 0 },
      { name: 'Blue', r: 0, g: 0, b: 255 },
      { name: 'Yellow', r: 255, g: 255, b: 0 },
      { name: 'Purple', r: 128, g: 0, b: 128 },
      { name: 'Orange', r: 255, g: 165, b: 0 },
      { name: 'Pink', r: 255, g: 192, b: 203 },
      { name: 'Brown', r: 165, g: 42, b: 42 },
      { name: 'Gray', r: 128, g: 128, b: 128 },
      { name: 'Navy', r: 0, g: 0, b: 128 },
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
}

export const colorAnalyzer = new ColorAnalyzerService();
