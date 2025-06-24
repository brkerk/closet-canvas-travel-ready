
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
        'microsoft/resnet-50',
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

    return await this.imageClassifier(imageElement);
  }
}

export const imageClassifier = new ImageClassifierService();
