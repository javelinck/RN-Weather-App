module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFiles: ['<rootDir>/jest.setup-files.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 15000,
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,
  transformIgnorePatterns: [
    'node_modules/(?!(' +
    'react-native|' +
    '@react-native|' +
    '@react-navigation|' +
    'react-clone-referenced-element|' +
    'expo-.*|' +
    '@expo/.*|' +
    'react-native-svg|' +
    'lottie-react-native|' +
    'expo-modules-core' +
    ')/)',
  ],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '^expo($|/.*)': '<rootDir>/__mocks__/expoMock.js',
    '^expo-constants$': '<rootDir>/__mocks__/expoConstantsMock.js',
    '^react-native/Libraries/Animated/NativeAnimatedHelper$':
      '<rootDir>/__mocks__/NativeAnimatedHelper.js',
  },
};
