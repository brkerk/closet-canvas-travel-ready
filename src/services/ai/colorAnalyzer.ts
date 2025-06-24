
export class ColorAnalyzerService {
  extractDominantColor(imageElement: HTMLImageElement): string {
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
}

export const colorAnalyzer = new ColorAnalyzerService();
