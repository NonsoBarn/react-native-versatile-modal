module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    test: {
      presets: [
        [
          'module:metro-react-native-babel-preset',
          {
            useTransformReactJSXExperimental: false,
          },
        ],
      ],
    },
  },
};
