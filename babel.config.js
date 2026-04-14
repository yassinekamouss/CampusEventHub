module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // ... tes autres plugins (ex: expo-router)
    ],
  };
};
