import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "../auth/authSlice";
import snackbarReducer from "./snackbarSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
     snackbar: snackbarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
