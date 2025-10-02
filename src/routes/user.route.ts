import { userController } from "@/controllers/user.controller";
import { authenticateToken, requireOwnershipOrAdmin } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

// Publics Routes
router.post("/register", userController.registerUser);

// Private Routes
router.use(authenticateToken, requireOwnershipOrAdmin);

router.get("/:id/profile", userController.getUser);

router.put("/:id/update", userController.updateUser);

router.delete("/:id/deactivate", userController.deactivateUser);

export default router;
