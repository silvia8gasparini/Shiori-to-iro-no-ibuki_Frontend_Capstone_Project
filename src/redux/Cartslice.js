import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
 addToCart: (state, action) => {
  const book = action.payload;
  const existingItem = state.items.find((item) => item.id === book.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.items.push({ ...book, quantity: 1 });
  }
},
    removeFromCart: (state, action) => {
  const idToRemove = action.payload;
  const existingItem = state.items.find((item) => item.id === idToRemove);

  if (existingItem && existingItem.quantity > 1) {
    existingItem.quantity -= 1;
  } else {
    state.items = state.items.filter((item) => item.id !== idToRemove);
  }
}
 
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
