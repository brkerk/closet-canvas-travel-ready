
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1054bee995584bbdb96118bd9dafe38e',
  appName: 'closet-canvas-travel-ready',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://1054bee9-9558-4bbd-b961-18bd9dafe38e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#ffffff',
    },
  },
};

export default config;
