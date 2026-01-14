import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch {}

beforeEach(() => {
  // legacy — стабільніше для RN стеків
  jest.useFakeTimers({ legacyFakeTimers: true });
});

afterEach(() => {
  // виконуємо все, що ще заплановано
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});
