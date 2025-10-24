import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import products from "./products";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, auth);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  products,
});

export default rootReducer;
