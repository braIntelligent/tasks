import { authController } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

//public routes
router.post("/login",  authController.loginUser);

// private routes
router.post("/refresh", authController.refreshUser);
router.post("/logout", authController.logoutUser);

export default router;
