import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Rotas públicas
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

// Rotas protegidas (requer token)
router.get("/verify", authMiddleware, AuthController.verifyToken);

router.get("/check-admin", authMiddleware, AuthController.checkAdmin);

router.get("/profile", authMiddleware, AuthController.getProfile);

export default router;

