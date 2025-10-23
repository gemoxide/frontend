import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./saga/auth";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

// Persist configuration for auth
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["login"], // Only persist login data
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(middleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export { store };
