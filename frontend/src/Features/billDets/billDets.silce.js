import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  base: 0,
  percentPerUnit: 0,
  totalTaxPercent: 0,
  tax: 0,
  state: "",
  range: [{ unitRange: 0, cost: 0, taxPerUnit: 0 }],
};

export const billDetsSlice = createSlice({
  name: "billDets",
  initialState,
  reducers: {
    setBillDets: (state, action) => {
      const { base, percentPerUnit, totalTaxPercent, tax, state: newState, range } = action.payload;
      state.base = base;
      state.percentPerUnit = percentPerUnit;
      state.totalTaxPercent = totalTaxPercent;
      state.tax = tax;
      state.state = newState;
      state.range = range;
    },
    updateBillDets: (state, action) => {
      const { field, value } = action.payload;
      if (state.hasOwnProperty(field)) {
        state[field] = value;
      }
    },
    addRange: (state, action) => {
      const newRange = action.payload;
      state.range.push(newRange);
    },
    removeRange: (state, action) => {
      const index = action.payload;
      state.range.splice(index, 1);
    },
  },
});

export const { setBillDets, updateBillDets, addRange, removeRange } = billDetsSlice.actions;

export default billDetsSlice.reducer;
