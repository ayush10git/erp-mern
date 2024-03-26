import { createSlice } from "@reduxjs/toolkit";
import { PiNutFill } from "react-icons/pi";

const initialState = {
  user: {},
  loading: true,
  userReducer: undefined
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const { userExist, userNotExist } = userReducer.actions;