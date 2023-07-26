module.exports = () => {
  const props =
    process.env.APP_VARIANT === "production"
      ? { name: "What BPM", identifier: "com.crhallen.whatbpm" }
      : { name: "What BPM (Dev)", identifier: "dev.crhallen.whatbpm" };

  return {
    expo: {
      name: props.name,
      slug: "what-bpm",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#000000",
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: props.identifier,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#000000",
        },
        package: props.identifier,
      },
      web: {
        favicon: "./assets/favicon.png",
      },
      extra: {
        eas: {
          projectId: "a254cb98-b8a5-446d-8eb5-ebe11efcbae6",
        },
      },
    },
  };
};
