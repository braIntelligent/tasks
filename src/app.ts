import { app, server } from "./servers/server";
import authRouter from "@/routes/auth.route";
import adminRouter from "@/routes/admin.route";
import userRouter from "@/routes/user.route";
import taskRouter from "@/routes/task.route";

//authorization
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/task", taskRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Page Not Found" });
});

server();
