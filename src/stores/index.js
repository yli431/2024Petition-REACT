import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./couter";
import userReducer from "./user.js"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user:userReducer
  },
});
