import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: { email: string } | null;
}

const getTokenPayload = (token: string | null) => {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return { email: decoded.email };
  } catch {
    return null;
  }
};

const initialToken = localStorage.getItem('token');
const initialUser = getTokenPayload(initialToken);

const initialState: AuthState = {
  token: initialUser ? initialToken : null,
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      const payload = getTokenPayload(action.payload.token);
      if (payload) {
        state.token = action.payload.token;
        state.user = payload;
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
