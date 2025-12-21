import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  role: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },
    logout(state) {
      state.token = null;
      state.role = null;
      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
