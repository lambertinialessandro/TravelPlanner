import { createSlice } from "@reduxjs/toolkit";

export const selectMapLang = (state) => state.map.mapLang;

const initialState = {
  mapLang: localStorage.getItem("map_lang") ?? "it",
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapLang: (state, { payload }) => {
      state.mapLang = payload;
      localStorage.setItem("map_lang", payload);
    },
  },
});

export const { setMapLang } = mapSlice.actions;

export default mapSlice.reducer;
