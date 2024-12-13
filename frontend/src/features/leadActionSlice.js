import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkedLeads: [],
};

const leadActionSlice = createSlice({
  name: "leadActions",
  initialState,
  reducers: {
    addLeadToSelection: (state, action) => {
      const newValue = action.payload;
      const oldArr = state.checkedLeads;
      state.checkedLeads = [...oldArr, newValue];
    },
    removeLeadFromSelection: (state, action) => {
      const removeValue = action.payload;
      const oldArr = state.checkedLeads;
      const newArr = oldArr.filter((val) => val !== removeValue);
      state.checkedLeads = newArr;
    },
  },
});

export const { addLeadToSelection, removeLeadFromSelection } =
  leadActionSlice.actions;
export default leadActionSlice.reducer;
