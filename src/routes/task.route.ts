import { taskController } from "@/controllers/task.controller";
import {
  authenticateToken,
  requireOwnershipOrAdmin,
} from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(authenticateToken, requireOwnershipOrAdmin);

router.post("/task", taskController.createTask);

router.get("task/:id", taskController.getTask);

router.get("tasks/", taskController.getTasks);

router.put("/task/:id/update", taskController.updateTask);

router.delete("/tasks/delete", taskController.deleteTasks);

router.delete("/task/:id/delete", taskController.deleteTask);

export default router