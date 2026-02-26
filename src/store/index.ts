import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice";
import bookReducer from "@/store/booksSlice";

export const store = configureStore({
  reducer: {
    // user: userReducer,
    book: bookReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;