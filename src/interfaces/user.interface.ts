import { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  tasks: Types.ObjectId;
  role: "user" | "admin";
  active: boolean;
  createdAt: Date;
}
