import express, { Application } from "express";
import morgan from "morgan";
import "dotenv/config";
import { connectionToDatabase } from "@/configs/db.config";

export const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT ?? 3000;

export function server() {
  app.listen(3000, () => {
    connectionToDatabase()
    console.log(`Running Server in Port: ${port}`);
  });
}
