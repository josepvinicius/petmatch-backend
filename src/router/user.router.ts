import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.post("/", userController.createUser);
router.put("/:id",authMiddleware, userController.updateUser);
router.delete("/:id",authMiddleware, userController.removeUser);

export default router;