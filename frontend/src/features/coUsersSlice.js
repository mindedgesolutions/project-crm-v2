import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coGroups: [],
};

const coUsersSlice = createSlice({
  name: "coUsers",
  initialState,
  reducers: {
    setCoGroups: (state, action) => {
      state.coGroups = action.payload;
    },
    unsetCoGroups: (state, action) => {
      state.coGroups = [];
    },
  },
});

export const { setCoGroups, unsetCoGroups } = coUsersSlice.actions;
export default coUsersSlice.reducer;
