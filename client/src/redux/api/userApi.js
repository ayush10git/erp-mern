import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTokens } from "../reducer/userTokenReducer";
import axios from "axios";

export const server = process.env.REACT_APP_SERVER;

export const userAPI = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/users/`,
    credentials: "include",
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      onSuccess: (data, { dispatch }) => {
        const { accesstoken, refreshToken } = data;
        dispatch(setTokens({ accesstoken, refreshToken }));
      },
    }),
  }),
});

export const getUser = async (id) => {
  try {
    const { data } = await axios.get(
      `${server}/api/v1/users/${id}`
    );

    return data;
  } catch (error) {
    throw error;
  }
};

export const { useLoginMutation } = userAPI;
