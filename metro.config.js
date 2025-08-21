// Metro config tuned for Expo SDK 53 + Firebase
// - Adds 'cjs' resolution for Firebase packages
// - Disables package exports to avoid resolver issues
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
