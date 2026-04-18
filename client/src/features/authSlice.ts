import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: { email: string } | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('userEmail') ? { email: localStorage.getItem('userEmail') as string } : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; email: string }>) {
      state.token = action.payload.token;
      state.user = { email: action.payload.email };
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userEmail', action.payload.email);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
