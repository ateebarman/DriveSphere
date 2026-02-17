import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

import userReducer from './userSlice';
import carReducer from './carSlice';
import adminReducer from './adminSlice';
import filterReducer from './filterSlice';
import bookingReducer from "./bookingSlice"

// Persist configuration - how and what parts of your Redux state should be persisted (saved) in storage
const persistConfig = {
  key: 'root',
  storage, 
  whitelist: ['car']
};

// Combine reducers
const rootReducer = combineReducers({
  app: userReducer,
  car: carReducer,
  admin: adminReducer,
  filter: filterReducer,
  booking : bookingReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store); // Create the persistor

export default store;
