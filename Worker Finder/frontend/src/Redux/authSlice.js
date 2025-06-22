import { createSlice } from '@reduxjs/toolkit';

const storedUser = JSON.parse(localStorage.getItem('user')); 

const initialState = {
  user: storedUser || null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload; 
      localStorage.setItem('user', JSON.stringify(action.payload)); 
    },
    logout: (state) => {
      state.user = null; 
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions; 
export default authSlice.reducer;