import { createSlice} from "@reduxjs/toolkit";

const initialState = {
  state:null,
};

 const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    set:(state,action)=>{
        state.state=action.payload;
    }
  },
});

export const {set} = billSlice.actions;

export default billSlice.reducer;
