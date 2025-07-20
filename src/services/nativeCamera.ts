
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface CapturedImage {
  id: string;
  url: string;
  file?: File;
  blob?: Blob;
}

export class NativeCameraService {
  static async isAvailable(): Promise<boolean> {
    return Capacitor.isNativePlatform();
  }

  static async takePicture(): Promise<CapturedImage | null> {
    try {
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024,
        correctOrientation: true
      });

      if (!image.dataUrl) {
        throw new Error('Failed to capture image');
      }

      // Convert data URL to blob for processing
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();

      return {
        id: Date.now().toString(),
        url: image.dataUrl,
        blob: blob
      };
    } catch (error) {
      console.error('Camera capture failed:', error);
      return null;
    }
  }

  static async selectFromGallery(): Promise<CapturedImage | null> {
    try {
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: 1024,
        height: 1024,
        correctOrientation: true
      });

      if (!image.dataUrl) {
        throw new Error('Failed to select image');
      }

      const response = await fetch(image.dataUrl);
      const blob = await response.blob();

      return {
        id: Date.now().toString(),
        url: image.dataUrl,
        blob: blob
      };
    } catch (error) {
      console.error('Gallery selection failed:', error);
      return null;
    }
  }

  static async requestPermissions(): Promise<boolean> {
    try {
      const permissions = await Camera.requestPermissions({
        permissions: ['camera', 'photos']
      });
      
      return permissions.camera === 'granted' && permissions.photos === 'granted';
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }
}
