import { userController } from "@/controllers/user.controller";
import { requireAdmin } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(requireAdmin);

router.get("/user/:id", userController.getUser);

router.get("/users", userController.getUsers);

router.put("/user/:id/update", userController.updateUser);

router.patch("/user/:id/activate", userController.activateUser);

// router.patch("/users/activate", userController.activateUsers);

router.delete("/user/:id/deactivate", userController.deactivateUser);

// router.delete("/users/deactivate", userController.deactivateUsers);


export default router