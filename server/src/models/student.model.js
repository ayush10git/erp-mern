import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide student name"],
    },
    email: {
      type: String,
      required: [true, "Provide your email"],
    },
    password: {
      type: String,
      required: [true, "Enter Password"],
    },
    usn: {
      type: String,
      required: [true, "Please provide student USN"],
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
      default: "student",
    },
  },
  {}
);

studentSchema.pre("save", function (next) {
  if (this.isModified("usn")) {
    this.usn = this.usn.toUpperCase();
  }
  next();
});

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Student = mongoose.model("Student", studentSchema);
