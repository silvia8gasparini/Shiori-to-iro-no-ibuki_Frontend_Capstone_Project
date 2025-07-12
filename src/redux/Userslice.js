import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  cart: [],
  cartItems: [],
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
       localStorage.setItem("cart", JSON.stringify(action.payload));
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(action.payload));
    },
    setReservations: (state, action) => {
      state.reservations = action.payload;
      localStorage.setItem("reservations", JSON.stringify(action.payload));
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      localStorage.setItem("favorites", JSON.stringify(action.payload));
    },
  },
});

export const {
  loginSuccess,
  logout,
  setCart,
  setCartItems,
  setReservations,
  setFavorites,
} = userSlice.actions;

export default userSlice.reducer;
