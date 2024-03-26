import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";

const generateAccessAndRefreshTokens = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const registerStudent = asyncHandler(async (req, res) => {
  const { email, name, password, usn } = req.body;

  if (!email || !password || !name || !usn) {
    throw new ApiError(400, "Please provide all fields");
  }

  const existedStudent = await Student.findOne({ email });

  if (existedStudent) {
    throw new ApiError(409, "student with email already exists");
  }

  const student = await Student.create({
    name,
    usn,
    email,
    password,
  });

  const createdStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  if (!createdStudent) {
    throw new ApiError(500, "Something went wrong while registering student!");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdStudent, "student registered successfully!")
    );
});

export const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const student = await Student.findOne({ email });

  if (!student) {
    throw new ApiError(404, "student does not exist");
  }

  if (student.role !== "student") {
    throw new ApiError(400, "not authorized to login");
  }

  const isPasswordValid = await student.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid student credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    student._id
  );

  const loggedInStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { student: loggedInStudent, accessToken, refreshToken },
        "student loggedIn successfully"
      )
    );
});

export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({}).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, students, "fetched all students"));
});

export const logoutstudent = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(
    req.student._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "student logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const student = await Student.findById(decodedToken?._id);

    if (!student) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== student?.refreshToken) {
      throw new ApiError(401, "refresh token has expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(student._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, newRefreshToken }),
        "Access token refreshed"
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});
