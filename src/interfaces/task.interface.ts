import { Document, Types } from "mongoose";

export interface ITask extends Document {
  userId: Types.ObjectId;
  tasks: { task: string; completed: boolean }[];
  createdAt: Date
}
