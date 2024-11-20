import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leadModal: false,
  actionLead: {},
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
  },
});

export const { openLeadModal, closeLeadModal, setActionLead, unsetActionLead } =
  leadSlice.actions;
export default leadSlice.reducer;
