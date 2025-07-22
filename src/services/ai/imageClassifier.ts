
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

export class ImageClassifierService {
  private imageClassifier: any = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.loadModel();
    return this.initPromise;
  }

  private async loadModel() {
    try {
      console.log('Loading image classification model...');
      
      this.imageClassifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
        { device: 'webgpu' }
      );
      
      this.isInitialized = true;
      console.log('Image classification model loaded successfully');
    } catch (error) {
      console.error('Failed to load image classification model:', error);
      throw error;
    }
  }

  async classify(imageElement: HTMLImageElement) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Convert HTMLImageElement to canvas for proper input format
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;
    ctx.drawImage(imageElement, 0, 0);

    return await this.imageClassifier(canvas);
  }
}

export const imageClassifier = new ImageClassifierService();
