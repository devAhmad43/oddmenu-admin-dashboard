// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    color: '##E460E6', // default color
  },
  reducers: {
    setThemeColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

export const { setThemeColor } = themeSlice.actions;
export const selectThemeColor = (state) => state.theme.color;
export default themeSlice.reducer;
