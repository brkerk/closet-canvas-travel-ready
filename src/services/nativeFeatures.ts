import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

export class NativeFeatures {
  static async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Configure status bar for iOS
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      
      // Hide splash screen after initialization
      await SplashScreen.hide();
    } catch (error) {
      console.error('Native features initialization failed:', error);
    }
  }

  static async vibrate(style: ImpactStyle = ImpactStyle.Medium): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic feedback failed:', error);
    }
  }

  static async vibrateLight(): Promise<void> {
    await this.vibrate(ImpactStyle.Light);
  }

  static async vibrateMedium(): Promise<void> {
    await this.vibrate(ImpactStyle.Medium);
  }

  static async vibrateHeavy(): Promise<void> {
    await this.vibrate(ImpactStyle.Heavy);
  }

  static async setStatusBarLight(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.setStyle({ style: Style.Light });
    } catch (error) {
      console.error('Status bar style change failed:', error);
    }
  }

  static async setStatusBarDark(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
      await StatusBar.setStyle({ style: Style.Dark });
    } catch (error) {
      console.error('Status bar style change failed:', error);
    }
  }
}