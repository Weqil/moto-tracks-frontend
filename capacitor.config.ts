import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.policam.motokros',
  appName: 'Мотокросс',
  webDir: 'www/browser',
  bundledWebRuntime: false,
  server: {
    url: 'https://moto.vokrug.city',
  },
};

export default config;
