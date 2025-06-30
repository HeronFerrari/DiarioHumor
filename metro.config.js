const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para extensões de arquivo que o Firebase usa
config.resolver.sourceExts.push('cjs');

// Desabilita uma funcionalidade do Metro que entra em conflito com o Firebase
config.resolver.unstable_enablePackageExports = false;

module.exports = config;