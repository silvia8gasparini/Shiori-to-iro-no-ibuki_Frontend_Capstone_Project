import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  cart: [],
  reservations: [],
  favorites: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.cart = [];
      state.reservations = [];
      state.favorites = [];
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setReservations: (state, action) => {
      state.reservations = action.payload;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
});

export const {
  loginSuccess,
  logout,
  setCart,
  setReservations,
  setFavorites,
} = userSlice.actions;

export default userSlice.reducer;
