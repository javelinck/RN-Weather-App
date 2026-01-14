import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import weatherReducer from '../features/weather/weather.slice';
import { weatherApi } from '../services/weather.api';

const persistVersion = 1;

const persistConfig = {
  key: 'weather',
  version: persistVersion,
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  weather: persistReducer(persistConfig, weatherReducer),
  [weatherApi.reducerPath]: weatherApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }).concat(weatherApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
