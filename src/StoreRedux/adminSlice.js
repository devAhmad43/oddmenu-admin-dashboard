import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'admin',
    initialState: {
        admin: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Signup request
        signupRequest: (state) => {
            state.loading = true;
            state.error = null;  // Reset error on new signup request
        },
        // Signup success
        signupSuccess: (state, action) => {
            state.admin = action.payload;
            state.loading = false;
        },
        // Signup failure
        signupFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;  // Capture error message
        },
        // Add admin manually
        addAdmin: (state, action) => {
            state.admin = action.payload;
        },
    },
});

export const selectAdmin = (state) => state.admin.admin;
export const selectAuthLoading = (state) => state.admin.loading;
export const selectAuthError = (state) => state.admin.error;

export const { signupRequest, signupSuccess, signupFailure, addAdmin } = authSlice.actions;
export default authSlice.reducer;
