// Import createSlice function from Redux Toolkit to create a slice of the Redux store
import { createSlice } from "@reduxjs/toolkit";
// Import PayloadAction type for typing action payloads
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the interface for the snackbar state
export interface SnackbarState {
  open: boolean; // Whether the snackbar is visible
  message: string; // The message to display in the snackbar
  severity: "success" | "error" | "info" | "warning"; // The type of message (affects styling)
}

// Initial state for the snackbar slice
const initialState: SnackbarState = {
  open: false, // Snackbar starts hidden
  message: "", // No message initially
  severity: "info", // Default severity is info
};

// Create a Redux slice for managing snackbar state
const snackbarSlice = createSlice({
  name: "snackbar", // Name of the slice (used in action types)
  initialState, // Initial state defined above
  reducers: {
    // Reducer to show the snackbar with a message and severity
    showSnackbar(
      state,
      action: PayloadAction<Omit<SnackbarState, "open">> // Payload excludes 'open' since it's always set to true
    ) {
      state.open = true; // Make the snackbar visible
      state.message = action.payload.message; // Set the message from the action
      state.severity = action.payload.severity; // Set the severity from the action
    },
    // Reducer to hide the snackbar
    hideSnackbar(state) {
      state.open = false; // Hide the snackbar
    },
  },
});

// Export the action creators for use in components
export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
// Export the reducer to be included in the Redux store
export default snackbarSlice.reducer;
