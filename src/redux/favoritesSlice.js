/* import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: JSON.parse(localStorage.getItem("favorites")) || [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const { id, title, author } = action.payload;
      const existing = state.items.find((b) => b.id === id);

      if (existing) {
        state.items = state.items.filter((b) => b.id !== id);
      } else {
        state.items.push({ id, title, author });
      }

      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
    setFavorites: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
 */