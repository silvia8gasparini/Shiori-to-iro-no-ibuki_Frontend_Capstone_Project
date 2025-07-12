import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const book = action.payload;
      const existingItem = state.items.find((item) => item.id === book.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          id: book.id,
          title: book.title,
          price: book.price,
          quantity: 1,
        });
      }

      const user = JSON.parse(localStorage.getItem("userData"));
const key = user ? `cartItems_${user.id}` : "cartItems";
localStorage.setItem(key, JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }

      const user = JSON.parse(localStorage.getItem("userData"));
const key = user ? `cartItems_${user.id}` : "cartItems";
localStorage.setItem(key, JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
