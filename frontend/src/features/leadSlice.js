import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leadModal: false,
  actionLead: {},
  leadList: [],
  allStatus: [],
  allStates: [],
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    openLeadModal: (state) => {
      state.leadModal = true;
    },
    closeLeadModal: (state) => {
      state.leadModal = false;
    },
    setActionLead: (state, action) => {
      state.actionLead = action.payload;
    },
    unsetActionLead: (state, action) => {
      state.actionLead = {};
    },
    setLeadList: (state, action) => {
      state.leadList = action.payload;
    },
    setAllStatus: (state, action) => {
      state.allStatus = action.payload;
    },
    setAllStates: (state, action) => {
      state.allStates = action.payload;
    },
  },
});

export const {
  openLeadModal,
  closeLeadModal,
  setActionLead,
  unsetActionLead,
  setLeadList,
  setAllStatus,
  setAllStates,
} = leadSlice.actions;
export default leadSlice.reducer;
