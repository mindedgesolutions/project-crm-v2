import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "@/features/currentUserSlice";
import commonReducer from "@/features/commonSlice";
import coUsersReducer from "@/features/coUsersSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
    common: commonReducer,
    coUsers: coUsersReducer,
  },
});

export default store;
