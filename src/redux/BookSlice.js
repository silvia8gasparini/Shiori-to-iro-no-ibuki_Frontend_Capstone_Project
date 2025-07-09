import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBooksByMicroSeasonId = createAsyncThunk(
  "books/fetchByMicroSeasonId",
  async (microSeasonId) => {
    const res = await fetch(`/api/books/by-microseason/${microSeasonId}`);
    if (!res.ok) throw new Error("Errore nel recupero dei libri");
    return await res.json();
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    booksForSeason: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksByMicroSeasonId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksByMicroSeasonId.fulfilled, (state, action) => {
        state.loading = false;
        state.booksForSeason = action.payload;
      })
      .addCase(fetchBooksByMicroSeasonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default booksSlice.reducer;
