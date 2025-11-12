import userController from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.removeUser);

export default router;