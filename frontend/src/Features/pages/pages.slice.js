import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUpdate: false,
  addDets: false,
  drawer:false,
  isbill:false,
  isCostRange:false,
};

const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      state.isUpdate = !state.isUpdate;
    },
    addDetsPage: (state, action) => {
      state.addDets = !state.addDets;
    },
    drawerToogle:(state,action)=>{
      state.drawer= !state.drawer;
    },
    billDetsPage:(state,action)=>{
      state.isbill= !state.isbill;
    },
    costRangePage:(state,action)=>{
      state.isCostRange= !state.isCostRange;
    },
  },
});

export const { updatePage, addDetsPage,drawerToogle,billDetsPage,costRangePage } = pageSlice.actions;

export default pageSlice.reducer;
