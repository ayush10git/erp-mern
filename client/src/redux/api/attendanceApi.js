import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const server = process.env.REACT_APP_SERVER;

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/attendance/`,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["attendance"],
  endpoints: (builder) => ({
    markAttendance: builder.mutation({
      query: (data) => ({
        url: "mark-attendance",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["attendance"],
    }),

    attendanceRecords: builder.query({
      query: (date) => `records?dateString=${date}`,
      providesTags: ["attendance"],
    }),
  }),
});

export const { useAttendanceRecordsQuery, useMarkAttendanceMutation } =
  attendanceApi;
