// .envファイルを読み込むために、ファイルの先頭でdotenvをインポートして設定
require('dotenv').config();

export default {
  expo: {
    name: "LiveChainIizukaExpo",
    slug: "LiveChainIizukaExpo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "livechainiizukaexpo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.LiveChainIizukaExpo",
      
      // ▼▼▼ この infoPlist を追加しました ▼▼▼
      infoPlist: {
        "NSLocationWhenInUseUsageDescription": "マップ上にあなたの現在地と周辺の施設を表示するために、位置情報を利用します。"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.LiveChainIizukaExpo"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      [
        "expo-maps",
        {
          "ios": {
            // .envファイルからAPIキーを読み込む
            "googleMapsApiKey": process.env.Maps_API_KEY
            
          },
          "android": {
            // .envファイルからAPIキーを読み込む
            "googleMapsApiKey": process.env.Maps_API_KEY
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
};