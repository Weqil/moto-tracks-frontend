import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.policam.motokros',
  appName: 'Мотокросс',
  webDir: 'www/browser',
  bundledWebRuntime: false,
  plugins:{
      SplashScreen: {
        launchShowDuration: 1000,    // Время показа (мс)
        backgroundColor: "#ADD8E6",  // Светло-голубой фон
        showSpinner: false, 
        iosScaleType: "FIT_XY",
        androidScaleType: "FIT_XY", // Масштабирование картинки
        androidSpinnerStyle: "large", // Размер спиннера (Android)
        iosSpinnerStyle: "large", // Размер спиннера (iOS)
        splashFullScreen: false,  // Полноэкранный режим
        splashImmersive: true    // Скрывает системные панели
      }
    },
  // server: {
  //   url: 'https://dev-moto.vokrug.city',
  // },
};

export default config;
