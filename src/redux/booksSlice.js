import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBooksByMicroSeasonId = createAsyncThunk(
  "books/fetchByMicroSeasonId",
  async (microSeasonId) => {
    const res = await fetch(`/books/microseason/${microSeasonId}`);
    if (!res.ok) throw new Error("Errore nel recupero dei libri");
    return await res.json();
  }
);

export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (bookId) => {
    const res = await fetch(`/books/${bookId}`);
    if (!res.ok) throw new Error("Errore nel recupero del libro");
    return await res.json();
  }
);


const booksSlice = createSlice({
  name: "books",
  initialState: {
    booksForSeason: [],
    loading: false,
    error: null,
     bookDetails: {
      data: null,
      loading: false,
      error: null,
    },
  },
    reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksByMicroSeasonId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksByMicroSeasonId.fulfilled, (state, action) => {
        state.loading = false;
        state.booksForSeason = action.payload.content;      })
      .addCase(fetchBooksByMicroSeasonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

       .addCase(fetchBookById.pending, (state) => {
        state.bookDetails.loading = true;
        state.bookDetails.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.bookDetails.loading = false;
        state.bookDetails.data = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.bookDetails.loading = false;
        state.bookDetails.error = action.error.message;
      });
  },
});
export default booksSlice.reducer;
