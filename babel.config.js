module.exports = function(api) {
  api.cache(true);
  return {
    // Esta é a configuração base para qualquer projeto Expo
    presets: ['babel-preset-expo'],
    // Aqui adicionamos o plugin que o 'reanimated' precisa para funcionar
    plugins: ['react-native-reanimated/plugin'],
  };
};