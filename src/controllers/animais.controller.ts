import type { Request, Response } from "express";
import Animais from "../model/Animais.js";
import { Op } from "sequelize";

export class AnimaisController {
    
    // Listar todos os animais
    public static async findAll(req: Request, res: Response) {
        try {
            const animais = await Animais.findAll();
            
            res.status(200).json({
                msg: "Animais listados com sucesso.",
                animais,
                total: animais.length
            });
            
        } catch (error: any) {
            console.error('Erro ao listar animais:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Buscar animal por ID
    public static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const animal = await Animais.findByPk(id);

            if (!animal) {
                return res.status(404).json({ msg: 'Animal não encontrado' });
            }

            res.status(200).json({
                msg: "Animal encontrado com sucesso.",
                animal
            });
            
        } catch (error: any) {
            console.error('Erro ao buscar animal:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Buscar animais por status (disponíveis, adotados, etc)
    public static async findByStatus(req: Request, res: Response) {
        try {
            const { status } = req.params;
            const animais = await Animais.findAll({
                where: { status }
            });

            res.status(200).json({
                msg: `Animais com status '${status}' listados com sucesso.`,
                animais,
                total: animais.length
            });
            
        } catch (error: any) {
            console.error('Erro ao buscar animais por status:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Buscar animais por espécie
    public static async findByEspecie(req: Request, res: Response) {
        try {
            const { especie } = req.params;
            const animais = await Animais.findAll({
                where: { 
                    especie: {
                        [Op.iLike]: `%${especie}%`
                    }
                }
            });

            res.status(200).json({
                msg: `Animais da espécie '${especie}' listados com sucesso.`,
                animais,
                total: animais.length
            });
            
        } catch (error: any) {
            console.error('Erro ao buscar animais por espécie:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Criar novo animal
    public static async create(req: Request, res: Response) {
        try {
            const { 
                nome, 
                especie, 
                faca, 
                sexo, 
                nascimento, 
                porte, 
                saude, 
                status = 'disponível', 
                foto
            } = req.body;

            // Validação dos campos obrigatórios
            if (!nome || !especie || !faca || !sexo || !nascimento || !porte || !saude) {
                return res.status(400).json({
                    msg: 'Todos os campos são obrigatórios, exceto status.',
                    camposObrigatorios: ['nome', 'especie', 'faca', 'sexo', 'nascimento', 'porte', 'saude']
                });
            }

             // Validação simples da foto (Base64)
            if (foto && !foto.startsWith('data:image/')) {
                return res.status(400).json({
                    msg: 'A foto deve estar em formato Base64 válido (data:image/...)'
                });
            }

            const animal = await Animais.create({
                nome,
                especie,
                faca,
                sexo,
                nascimento: new Date(nascimento),
                porte,
                saude,
                status,
                foto: foto || null
            });

            res.status(201).json({
                msg: 'Animal cadastrado com sucesso!',
                animal
            });
            
        } catch (error: any) {
            console.error('Erro ao criar animal:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    msg: 'Dados inválidos fornecidos.',
                    errors: error.errors.map((err: any) => err.message)
                });
            }
            
            res.status(500).json({
                msg: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Atualizar animal
    public static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { 
                nome, 
                especie, 
                faca, 
                sexo, 
                nascimento, 
                porte, 
                saude, 
                status,
                foto 
            } = req.body;

            // Verificar se o animal existe
            const animal = await Animais.findByPk(id);
            if (!animal) {
                return res.status(404).json({ msg: 'Animal não encontrado' });
            }

            // Preparar dados para atualização
            const updateData: any = {};
            if (nome) updateData.nome = nome;
            if (especie) updateData.especie = especie;
            if (faca) updateData.faca = faca;
            if (sexo) updateData.sexo = sexo;
            if (nascimento) updateData.nascimento = new Date(nascimento);
            if (porte) updateData.porte = porte;
            if (saude) updateData.saude = saude;
            if (status) updateData.status = status;
            if (foto) updateData.foto = foto;

            // Verificar se há dados para atualizar
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ 
                    msg: 'Nenhum campo foi fornecido para atualização.' 
                });
            }

            await Animais.update(updateData, { 
                where: { id }
            });

            // Buscar animal atualizado
            const animalAtualizado = await Animais.findByPk(id);

            res.status(200).json({
                msg: 'Animal atualizado com sucesso!',
                animal: animalAtualizado
            });
            
        } catch (error: any) {
            console.error('Erro ao atualizar animal:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    msg: 'Dados inválidos fornecidos.',
                    errors: error.errors.map((err: any) => err.message)
                });
            }
            
            res.status(500).json({
                msg: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Deletar animal
    public static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const animal = await Animais.findByPk(id);
            if (!animal) {
                return res.status(404).json({ msg: 'Animal não encontrado' });
            }

            await Animais.destroy({ where: { id } });

            res.status(200).json({
                msg: 'Animal deletado com sucesso!',
                animalDeletado: animal
            });
            
        } catch (error: any) {
            console.error('Erro ao deletar animal:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Listar animais disponíveis para adoção
    public static async findDisponiveis(req: Request, res: Response) {
        try {
            const animais = await Animais.findAll({
                where: { status: 'disponível' }
            });

            res.status(200).json({
                msg: "Animais disponíveis para adoção listados com sucesso.",
                animais,
                total: animais.length
            });
            
        } catch (error: any) {
            console.error('Erro ao listar animais disponíveis:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}