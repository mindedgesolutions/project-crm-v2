import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coGroups: [],
  currentGroups: [],
};

const coUsersSlice = createSlice({
  name: "coUsers",
  initialState,
  reducers: {
    setCoGroups: (state, action) => {
      state.coGroups = action.payload;
    },
    unsetCoGroups: (state) => {
      state.coGroups = [];
    },
    newGroupSet: (state, action) => {
      const selectedGroups = JSON.stringify(action.payload);
      state.currentGroups = selectedGroups;
    },
  },
});

export const { setCoGroups, unsetCoGroups, newGroupSet } = coUsersSlice.actions;
export default coUsersSlice.reducer;
