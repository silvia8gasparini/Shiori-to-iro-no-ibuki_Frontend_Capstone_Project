import { configureStore } from "@reduxjs/toolkit";
import currentMicroSeasonReducer from "./currentMicroSeasonSlice";
import nextMicroSeasonsReducer from "./nextMicroSeasonsSlice";
import selectedColorReducer from "./selectedColorSlice";
import booksReducer from "./booksSlice";
import favoritesReducer from "./favoritesSlice";

const store = configureStore({
  reducer: {
    currentMicroSeason: currentMicroSeasonReducer,
    nextMicroSeasons: nextMicroSeasonsReducer,
    selectedColor: selectedColorReducer,
    books: booksReducer, 
    favorites: favoritesReducer,
  },
});

export default store;
