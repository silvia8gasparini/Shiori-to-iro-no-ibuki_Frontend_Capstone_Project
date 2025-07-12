import { configureStore } from "@reduxjs/toolkit";
import currentMicroSeasonReducer from "./currentMicroSeasonSlice";
import nextMicroSeasonsReducer from "./nextMicroSeasonsSlice";
import selectedColorReducer from "./selectedColorSlice";
import booksReducer from "./booksSlice";
import userReducer from "./userSlice";
import cartReducer from "./Cartslice";
import { loadCartState, saveCartState } from "./cartStorage";

const persistedCart = loadCartState();

const store = configureStore({
  reducer: {
    currentMicroSeason: currentMicroSeasonReducer,
    nextMicroSeasons: nextMicroSeasonsReducer,
    selectedColor: selectedColorReducer,
    books: booksReducer,
    user: userReducer,     
    cart: cartReducer,
  },
  preloadedState: {
    cart: persistedCart || { items: [] },
  },
});

store.subscribe(() => {
  const state = store.getState();
  saveCartState(state.cart);
});

export default store;
