import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  networks: [],
};

const networkSlice = createSlice({
  name: "networks",
  initialState,
  reducers: {
    setNetworks: (state, action) => {
      state.networks = action.payload;
    },
  },
});

export const { setNetworks } = networkSlice.actions;
export default networkSlice.reducer;
