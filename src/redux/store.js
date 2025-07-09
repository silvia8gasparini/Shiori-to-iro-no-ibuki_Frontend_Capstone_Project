import { configureStore } from "@reduxjs/toolkit";
import currentMicroSeasonReducer from "./currentMicroSeasonSlice";
import nextMicroSeasonsReducer from "./nextMicroSeasonsSlice";
import selectedColorReducer from "./selectedColorSlice";
import booksReducer from "./booksSlice";

const store = configureStore({
  reducer: {
    currentMicroSeason: currentMicroSeasonReducer,
    nextMicroSeasons: nextMicroSeasonsReducer,
    selectedColor: selectedColorReducer,
    books: booksReducer, 
  },
});

export default store;
