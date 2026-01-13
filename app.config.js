require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  name: "RN-Weather-App",
  slug: "RN-Weather-App",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "reactnativeweatherapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "We use your location to show local weather.",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    permissions: ["ACCESS_COARSE_LOCATION", "ACCESS_FINE_LOCATION"],
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "backgroundColor": "#000000"
        }
      }
    ]
  ],
  extra: {
    OWM_API_KEY: process.env.OWM_API_KEY,
  },
});
