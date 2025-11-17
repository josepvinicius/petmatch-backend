import { Router } from "express";
import { DoacoesController } from "../controllers/doacoes.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

// Rotas de consulta
router.get("/", DoacoesController.findAll);
router.get("/estatisticas", DoacoesController.getEstatisticas);
router.get("/usuario/:usuarioId", DoacoesController.findByUsuario);
router.get("/:id", DoacoesController.findById);

// Rotas de manipulação
router.post("/resgate", DoacoesController.registrarResgate);
router.post("/adocao", DoacoesController.registrarAdocao);
router.put("/:id/observacoes", DoacoesController.updateObservacoes);
router.delete("/:id", DoacoesController.delete);

export default router;