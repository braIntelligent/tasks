import { IUser } from "@/interfaces/user.interface";
import { model, Schema, Types } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    refreshToken: { type: Schema.Types.ObjectId, ref: "Token" },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    role: { type: String, enum: ["admin", "user"], default: "user" },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const User = model<IUser>("User", UserSchema);
