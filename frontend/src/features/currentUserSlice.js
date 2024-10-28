import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: {},
};

const currentUser = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    unsetCurrentUser: (state) => {
      state.currentUser = {};
    },
  },
});

export const { setCurrentUser, unsetCurrentUser } = currentUser.actions;
export default currentUser.reducer;
