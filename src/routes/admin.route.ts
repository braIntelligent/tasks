import { adminController } from "@/controllers/admin.controller";
import { requireAdmin } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.use(requireAdmin);

router.get("/user/:id", adminController.getUser);

router.get("/users", adminController.getUsers);

router.put("/user/:id/update", adminController.updateUser);

router.patch("/user/:id/activate", adminController.activateUser);

router.patch("/users/activate", adminController.activateUsers);

router.delete("/user/:id/deactivate", adminController.deactivateUser);

router.delete("/users/deactivate", adminController.deactivateUsers);


export default router