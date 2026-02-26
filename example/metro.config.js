const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Watch the library src/ so edits trigger Fast Refresh
config.watchFolders = [path.resolve(__dirname, '..', 'src')];

// When library files import react/react-native, resolve from example's node_modules
config.resolver.extraNodeModules = {
  react: path.resolve(__dirname, 'node_modules', 'react'),
  'react-native': path.resolve(__dirname, 'node_modules', 'react-native'),
};

module.exports = config;
