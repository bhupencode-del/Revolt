module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add other plugins if needed here
      'react-native-reanimated/plugin' // must be last
    ],
  };
};
