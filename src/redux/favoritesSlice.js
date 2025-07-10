import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const bookId = action.payload;
      if (state.items.includes(bookId)) {
        state.items = state.items.filter((id) => id !== bookId);
      } else {
        state.items.push(bookId);
      }
    },
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
