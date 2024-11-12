import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coGroups: [],
  currentGroups: [],
  currentUsers: [],
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
    newUserSet: (state, action) => {
      const selectedUsers = JSON.stringify(action.payload);
      state.currentUsers = selectedUsers;
    },
  },
});

export const { setCoGroups, unsetCoGroups, newGroupSet, newUserSet } =
  coUsersSlice.actions;
export default coUsersSlice.reducer;
