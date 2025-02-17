import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem("theme") || "light";

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
        if(state.mode==="dark"){
          document.body.style.backgroundColor = "#1f2937";
        }
      },
    },
  });
  
  export const { toggleTheme } = themeSlice.actions;
  export default themeSlice.reducer;