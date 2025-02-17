import {combineReducers,configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../Features/auth/auth.slice.js";
import billReducer from "../Features/auth/billDets.slice.js";
import themeReducer from "../Features/theme/theme.slice.js";
import pageReducer from "../Features/pages/pages.slice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  theme:themeReducer,
  pages:pageReducer,
  bill:billReducer,
});

const rootPersistConfig = {
  key: ["auth","theme","pages","bill"],
  storage,
  whitelist:["auth","theme","pages","bill"],
};

const persistedReducer = persistReducer(rootPersistConfig, rootReducer );

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };