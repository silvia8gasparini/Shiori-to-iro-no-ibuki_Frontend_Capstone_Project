import { configureStore } from "@reduxjs/toolkit";
import currentMicroSeasonReducer from "./currentMicroSeasonSlice";
import nextMicroSeasonsReducer from "./nextMicroSeasonsSlice";

const store = configureStore({
  reducer: {
    currentMicroSeason: currentMicroSeasonReducer,
    nextMicroSeasons: nextMicroSeasonsReducer,
    // book: bookReducer,
    // color: colorReducer
  },
});

export default store;
