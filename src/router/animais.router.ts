import { Router } from "express";
import { AnimaisController } from "../controllers/animais.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Rotas de consulta
router.get("/", AnimaisController.findAll);
router.get("/disponiveis", AnimaisController.findDisponiveis);
router.get("/status/:status", AnimaisController.findByStatus);
router.get("/especie/:especie", AnimaisController.findByEspecie);
router.get("/:id", AnimaisController.findById);

// Rotas de manipulação
router.post("/", AnimaisController.create);
router.put("/:id", AnimaisController.update);
router.delete("/:id", AnimaisController.delete);

export default router;