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
      document.documentElement.classList.toggle("dark", state.mode === "dark");
      document.body.style.backgroundColor = state.mode === "dark" ? "#1f2937" : "#FFFFFF";
    },
    initializeTheme: (state) => {
      state.mode = initialTheme;
      document.documentElement.classList.toggle("dark", state.mode === "dark");
      document.body.style.backgroundColor = state.mode === "dark" ? "#1f2937" : "#FFFFFF";
    },
  },
});

export const { toggleTheme,initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
