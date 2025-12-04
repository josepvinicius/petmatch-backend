import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../model/Usuario.js";
import { Op } from "sequelize";
import type { Request, Response } from "express";
import type { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

export interface TokenPayload {
    id: string;       // <- não precisa ser opcional
    email: string;
    nome: string;
    isAdmin?: boolean;
}

async function comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
}

export class AuthController {

    private static generateToken(payload: TokenPayload): string {
        const secret = process.env.JWT_SECRET as string;

        const options: SignOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || "24h"
        };

        return jwt.sign(payload, secret, options);
    }

    // 📌 Registrar usuário
    public static async register(req: Request, res: Response) {
        try {
            const { nome, email, CPF, senha } = req.body;

            if (!nome || !email || !CPF || !senha)
                return res.status(400).json({ msg: "Todos os campos são obrigatórios" });

            const existingUser = await Usuario.findOne({
                where: { [Op.or]: [{ email }, { CPF }] }
            });

            if (existingUser)
                return res.status(400).json({ msg: "Email ou CPF já cadastrado" });

            const usuario = await Usuario.create({ nome, email, CPF, senha });

            const token = AuthController.generateToken({
                id: usuario.id as unknown as string,
                email: usuario.email,
                nome: usuario.nome
            });

            return res.status(201).json({
                msg: "Usuário registrado com sucesso",
                token,
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    CPF: usuario.CPF
                }
            });

        } catch (error) {
            console.error("Erro no registro:", error);
            return res.status(500).json({ msg: "Erro interno" });
        }
    }

    // 🔍 Validação interna do token
    public static verifyToken(token: string): TokenPayload {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET não configurado");

        return jwt.verify(token, secret) as TokenPayload;
    }

    // 👤 Perfil do usuário logado
    public static async getProfile(req: any, res: Response) {
        try {
            const usuario = await Usuario.findByPk(req.user.id, {
                attributes: { exclude: ["senha"] }
            });

            if (!usuario) return res.status(404).json({ msg: "Usuário não encontrado" });

            return res.json({
                msg: "Perfil carregado com sucesso",
                user: usuario
            });

        } catch {
            return res.status(500).json({ msg: "Erro interno ao obter perfil" });
        }
    }

    // Na classe AuthController, adicione:
    public static async checkAdmin(req: any, res: Response) {
        try {
            const user = await Usuario.findByPk(req.user.id);

            if (!user) {
                return res.status(404).json({ msg: "Usuário não encontrado" });
            }

            // Lógica simples: admin é quem tem email específico
            const isAdmin = user.email === 'admin@petmatch.com';

            return res.json({
                msg: "Status verificado",
                isAdmin,
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email,
                    isAdmin
                }
            });

        } catch (error) {
            console.error("Erro ao verificar admin:", error);
            return res.status(500).json({ msg: "Erro interno" });
        }
    }

    // 🔐 Login
    public static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha)
                return res.status(400).json({ msg: "Email e senha são obrigatórios" });

            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario)
                return res.status(401).json({ msg: "Usuário não encontrado" });

            const validPassword = await comparePassword(senha, usuario.senha);
            if (!validPassword)
                return res.status(401).json({ msg: "Senha incorreta" });

            const token = AuthController.generateToken({
                id: usuario.id as unknown as string,
                email: usuario.email,
                nome: usuario.nome,
                isAdmin: usuario.email === 'admin@petmatch.com'
            });

            return res.json({
                msg: "Login realizado",
                token,
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    CPF: usuario.CPF
                }
            });

        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ msg: "Erro interno" });
        }
    }
}
