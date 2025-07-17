import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  microSeason: null,
  loading: false,
  error: null,
};

const currentMicroSeasonSlice = createSlice({
  name: "currentMicroSeason",
  initialState,
  reducers: {
    setMicroSeason: (state, action) => {
      state.microSeason = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setMicroSeason, setLoading, setError } = currentMicroSeasonSlice.actions;

export const fetchCurrentMicroSeason = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetch(`${
          import.meta.env.VITE_API_BASE_URL
        }/microseasons/current`);

    if (!res.ok) throw new Error("Errore nella richiesta");

    const data = await res.json();
    console.log("Dati ricevuti:", data);

    dispatch(setMicroSeason(data));
  } catch (err) {
    console.error("Errore nel fetch:", err);
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default currentMicroSeasonSlice.reducer;
