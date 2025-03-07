import { createSlice } from "@reduxjs/toolkit";

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialTheme = localStorage.getItem("theme") || getSystemTheme();

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: initialTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
    initializeTheme: (state) => {
      state.mode = initialTheme;
    },
  },
});

export const { toggleTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
