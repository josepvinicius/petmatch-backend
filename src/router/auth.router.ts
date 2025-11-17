import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

// Rotas públicas
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Rotas protegidas 
router.get("/verify", AuthController.verify);
router.get("/profile", AuthController.getProfile);

export default router;