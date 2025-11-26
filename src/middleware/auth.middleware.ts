import type { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        nome: string;
    };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ msg: "Token não fornecido" });

        const token = authHeader.split(" ")[1];

        if (!token)
            return res.status(401).json({ msg: "Token mal formatado" });

        const decoded = AuthController.verifyToken(token);
        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({ msg: "Token inválido ou expirado" });
    }
};
