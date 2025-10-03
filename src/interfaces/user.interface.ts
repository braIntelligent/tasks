import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken: Types.ObjectId;
  tasks: Types.ObjectId;
  role: "user" | "admin";
  active: boolean;
  createdAt: Date;
}
