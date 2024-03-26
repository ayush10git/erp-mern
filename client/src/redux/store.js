import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userApi";
import {userReducer} from "./reducer/userReducer";
import { attendanceApi } from "./api/attendanceApi";
import userTokenReducer from "./reducer/userTokenReducer";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    userToken: userTokenReducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer
  },
  middleware: (mid) => mid().concat(userAPI.middleware, attendanceApi.middleware),
});
