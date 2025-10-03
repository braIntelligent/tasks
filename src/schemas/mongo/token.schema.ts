import { model, Schema } from "mongoose";

const TokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String },
    createdAt: { type: Date, required: true },
  },
  { versionKey: false }
);

export const Token = model("Task", TokenSchema);
