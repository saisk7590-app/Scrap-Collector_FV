module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@features': './src/features',
          '@components': './src/components',
          '@navigation': './src/Navigation',
          '@services': './src/services',
          '@utils': './src/utils',
          '@screens': './src/Screens',
          '@constants': './src/constants',
          '@lib': './src/lib',
          '@context': './context',
        },
      },
    ],
  ],
};
