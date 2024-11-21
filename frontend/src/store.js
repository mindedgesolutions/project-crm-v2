import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "@/features/currentUserSlice";
import commonReducer from "@/features/commonSlice";
import coUsersReducer from "@/features/coUsersSlice";
import networkReducer from "@/features/networkSlice";
import leadReducer from "@/features/leadSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    common: commonReducer,
    coUsers: coUsersReducer,
    networks: networkReducer,
    leads: leadReducer,
  },
});

export default store;
