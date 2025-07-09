import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchColorByMicroSeasonId = createAsyncThunk(
  "colors/fetchByMicroSeasonId",
  async (microSeasonId) => {
    const res = await fetch(`/colors/microseason/${microSeasonId}`);
    const text = await res.text();
    console.log("Risposta grezza dal server:", text);

    if (!res.ok) {
      console.error("Errore HTTP:", res.status);
      throw new Error(`Errore HTTP ${res.status}: ${text}`);
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("JSON parsing failed:", err.message);
      throw new Error("Risposta non valida dal server");
    }
  }
);

const colorSlice = createSlice({
  name: "color",
  initialState: {
    selectedColor: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColorByMicroSeasonId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColorByMicroSeasonId.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedColor = action.payload;
      })
      .addCase(fetchColorByMicroSeasonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default colorSlice.reducer;
