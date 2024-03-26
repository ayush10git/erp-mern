import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/attendance.model.js";
import { isValid, parseISO, startOfDay, endOfDay, addDays } from "date-fns";
import { Student } from "../models/student.model.js";
import { ObjectId } from "mongoose";

export const markAttendance = asyncHandler(async (req, res) => {
  const { studentId, date } = req.body;

  if (!studentId || !date) {
    throw new ApiError(400, "provide all fields");
  }

  const today = new Date();
  const attendanceDate = new Date(date);

  if (attendanceDate > today) {
    throw new ApiError(400, "Cannot mark attendance for future dates");
  }

  let attendance = await Attendance.findOne({ studentId, date });

  if (attendance) {
    attendance.status = attendance.status === "present" ? "absent" : "present";
  } else {
    // Create new attendance record
    attendance = new Attendance({ studentId, date, status: "present" });
  }

  await attendance.save();

  return res
    .status(201)
    .json(new ApiResponse(200, attendance, "Attendance Marked successfully!"));
});

export const getAttendanceRecord = asyncHandler(async (req, res) => {
  const { dateString } = req.query;

  if (!dateString) {
    throw new ApiError(400, "Date parameter is required");
  }

  if (typeof dateString !== "string") {
    throw new ApiError(
      400,
      "Invalid date format. Please provide the date in the format YYYY-MM-DD"
    );
  }

  if (!isValid(parseISO(dateString))) {
    throw new ApiError(
      400,
      "Invalid date format. Please provide the date in the format YYYY-MM-DD"
    );
  }

  const students = await Student.find({}, ["name", "_id", "usn"]);
  const attendanceRecords = await Attendance.find({
    date: dateString,
  }).populate({
    path: "studentId",
    select: "-password ",
  });

  const attendanceMap = {};
  attendanceRecords.forEach((attendance) => {
    attendanceMap[attendance.studentId._id.toString()] = attendance;
  });

  const response = [];
  for (let student of students) {
    const studentId = student._id.toString();
    const attendance = attendanceMap[studentId];
    response.push({
      ...(attendance ? attendance.toObject() : { status: "absent" }),
      studentId,
      student: {
        name: student.name,
        _id: student._id,
        usn: student.usn,
      },
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, response, "Attendance records fetched successfully!")
    );
});
