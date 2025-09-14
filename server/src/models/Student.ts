import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";

export interface IStudent extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;

  generateAccessToken(): string;
  generateRefreshToken(): string;

}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    courseEnrolled: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

StudentSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "1d" }
  );
};

StudentSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET || "supersecretrefresh",
    { expiresIn: "7d" }
  );
};


export const Student = mongoose.model<IStudent>("Student", StudentSchema);
