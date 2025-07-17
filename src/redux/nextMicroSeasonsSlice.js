import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nextSeasons: [],
  loading: false,
  error: null,
};

const nextMicroSeasonsSlice = createSlice({
  name: "nextMicroSeasons",
  initialState,
  reducers: {
    setNextSeasons: (state, action) => {
      state.nextSeasons = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setNextSeasons, setLoading, setError } = nextMicroSeasonsSlice.actions;

export const fetchNextMicroSeasons = (count = 3) => async (dispatch) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "");
  try {
    dispatch(setLoading(true));
    const res = await fetch(`${baseUrl}/microseasons/next?count=${count}`);
    if (!res.ok) throw new Error("Errore nella richiesta");
    const data = await res.json();
    dispatch(setNextSeasons(data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default nextMicroSeasonsSlice.reducer;
