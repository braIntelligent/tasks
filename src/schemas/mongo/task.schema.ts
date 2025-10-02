import { ITask } from "@/interfaces/task.interface";
import { model, Schema } from "mongoose";

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tasks: [
      {
        task: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    createdAt: { type: Date, required: true },
  },
  { versionKey: false }
);

export const Task = model<ITask>("Task", TaskSchema);
