import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import Usuario from "../model/Usuario.js";
import { Op } from "sequelize";
import type { Request, Response } from "express";

export interface TokenPayload {
    id: number;
    email: string;
    nome: string;
}

async function comparePassword(senha: string, hash: string): Promise<boolean> {
    return bcrypt.compare(senha, hash);
}

export class AuthController {
    // Gerar token JWT
    private static generateToken(payload: TokenPayload): string {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
        }

        return jwt.sign(
            payload,
            secret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            } as any
        );
    }

    // Verificar token JWT
    public static verifyToken(token: string): TokenPayload {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET não está definido nas variáveis de ambiente')
        }

        return jwt.verify(token, secret) as TokenPayload;
    }

    // Registrar usuário
    public static async register(req: Request, res: Response) {
        try {
            const { nome, email, CPF, senha } = req.body;

            // Validação dos campos
            if (!nome || !email || !CPF || !senha) {
                return res.status(400).json({ 
                    msg: 'Todos os campos são obrigatórios.',
                    campos: { nome, email, CPF, senha: senha ? '***' : undefined }
                });
            }

            // Verificar se usuário já existe
            const existingUser = await Usuario.findOne({
                where: {
                    [Op.or]: [{ email }, { CPF }]
                }
            });

            if (existingUser) {
                return res.status(400).json({ 
                    msg: 'Email ou CPF já cadastrado no sistema.' 
                });
            }

            // Criar usuário (a senha será criptografada automaticamente pelo hook no model)
            const usuario = await Usuario.create({ 
                nome, 
                email, 
                CPF, 
                senha 
            });

            // Gerar token JWT
            const token = this.generateToken({
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            });

            // Não retornar a senha
            const userResponse = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                CPF: usuario.CPF,
                data_cadastro: usuario.data_cadastro
            };

            return res.status(201).json({
                msg: 'Usuário criado com sucesso!',
                user: userResponse,
                token
            });

        } catch (error: any) {
            console.error('Erro no registro:', error);
            
            // Tratamento de erros específicos
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    msg: 'Email ou CPF já cadastrado no sistema.' 
                });
            }
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ 
                    msg: 'Dados inválidos fornecidos.' 
                });
            }
            
            return res.status(500).json({ 
                msg: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Login de usuário
    public static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            // Validação dos campos
            if (!email || !senha) {
                return res.status(400).json({ 
                    msg: 'Email e senha são obrigatórios.' 
                });
            }

            // Buscar usuário pelo email
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) {
                return res.status(401).json({ msg: 'Usuário não encontrado' });
            }

            // Verificar senha
            const isPasswordValid = await comparePassword(senha, usuario.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ msg: 'Senha incorreta' });
            }

            // Gerar token JWT
            const token = this.generateToken({
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome
            });

            // Não retornar a senha
            const userResponse = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                CPF: usuario.CPF,
                data_cadastro: usuario.data_cadastro
            };

            return res.json({
                msg: 'Login realizado com sucesso!',
                user: userResponse,
                token
            });

        } catch (error: any) {
            console.error('Erro no login:', error);
            return res.status(500).json({ 
                msg: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Verificar token (usado pelo middleware)
    public static async verify(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ msg: 'Token não fornecido' });
            }

            const token = authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ msg: 'Token mal formatado' });
            }

            const decoded = this.verifyToken(token);
            
            return res.json({
                msg: 'Token válido',
                user: decoded
            });

        } catch (error: any) {
            return res.status(401).json({ 
                msg: 'Token inválido ou expirado' 
            });
        }
    }

    // Obter perfil do usuário autenticado
    public static async getProfile(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ msg: 'Token não fornecido' });
            }

            const token = authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ msg: 'Token mal formatado' });
            }

            const decoded = this.verifyToken(token);
            
            // Buscar dados atualizados do usuário
            const usuario = await Usuario.findByPk(decoded.id, {
                attributes: { exclude: ['senha'] }
            });

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
            }

            return res.json({
                msg: 'Perfil obtido com sucesso',
                user: usuario
            });

        } catch (error: any) {
            return res.status(401).json({ 
                msg: 'Token inválido ou expirado' 
            });
        }
    }
}