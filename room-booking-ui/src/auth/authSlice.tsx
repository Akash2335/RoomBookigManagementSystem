import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("role"),
  userId: localStorage.getItem("userId"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthState>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      if (action.payload.accessToken) {
        localStorage.setItem("token", action.payload.accessToken);
      }
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
      if (action.payload.userId) {
        localStorage.setItem("userId", action.payload.userId);
      }
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.userId = null;
      localStorage.clear();
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const refreshTokenSuccess = authSlice.actions.loginSuccess; // Reuse loginSuccess for refresh
export default authSlice.reducer;
