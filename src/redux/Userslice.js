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
      state.cartItems = [];
      state.reservations = [];
      state.favorites = [];

      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cart");
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      const userId = state.user?.id;
      if (userId) {
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(action.payload));
      }
    },
    setReservations: (state, action) => {
      state.reservations = action.payload;
      const userId = state.user?.id;
      if (userId) {
        localStorage.setItem(`reservations_${userId}`, JSON.stringify(action.payload));
      }
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
      const userId = state.user?.id;
      if (userId) {
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(action.payload));
      }
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
