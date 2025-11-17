import type { Request, Response } from "express";
import { Op } from "sequelize"; // ✅ IMPORTE O Op AQUI
import HistoricoAdocoes from "../model/HistoricoAdocoes.js";
import Animais from "../model/Animais.js";
import Usuario from "../model/Usuario.js";

export class DoacoesController {

    // Listar todas as adoções
    public static async findAll(req: Request, res: Response) {
        try {
            const doacoes = await HistoricoAdocoes.findAll({
                include: [
                    {
                        model: Usuario,
                        attributes: ['id', 'nome', 'email']
                    },
                    {
                        model: Animais,
                        attributes: ['id', 'nome', 'especie', 'porte']
                    }
                ],
                order: [['data_resgate', 'DESC']]
            });

            res.status(200).json({
                msg: "Histórico de adoções listado com sucesso.",
                doacoes,
                total: doacoes.length
            });

        } catch (error: any) {
            console.error('Erro ao listar adoções:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Buscar adoção por ID
    public static async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doacao = await HistoricoAdocoes.findByPk(id, {
                include: [
                    {
                        model: Usuario,
                        attributes: ['id', 'nome', 'email', 'CPF']
                    },
                    {
                        model: Animais,
                        attributes: ['id', 'nome', 'especie', 'sexo', 'porte', 'saude']
                    }
                ]
            });

            if (!doacao) {
                return res.status(404).json({ msg: 'Registro de adoção não encontrado' });
            }

            res.status(200).json({
                msg: "Registro de adoção encontrado com sucesso.",
                doacao
            });

        } catch (error: any) {
            console.error('Erro ao buscar adoção:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Buscar adoções por usuário
    public static async findByUsuario(req: Request, res: Response) {
        try {
            const { usuarioId } = req.params;
            const doacoes = await HistoricoAdocoes.findAll({
                where: { id_usuario: usuarioId },
                include: [
                    {
                        model: Animais,
                        attributes: ['id', 'nome', 'especie', 'porte', 'status']
                    }
                ],
                order: [['data_resgate', 'DESC']]
            });

            res.status(200).json({
                msg: "Adoções do usuário listadas com sucesso.",
                doacoes,
                total: doacoes.length
            });

        } catch (error: any) {
            console.error('Erro ao buscar adoções do usuário:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Registrar novo resgate (quando o animal chega ao abrigo)
    public static async registrarResgate(req: Request, res: Response) {
        try {
            const {
                data_resgate,
                observacoes,
                id_animais
            } = req.body;

            // Validação dos campos obrigatórios
            if (!data_resgate || !id_animais) {
                return res.status(400).json({
                    msg: 'Data do resgate e ID do animal são obrigatórios.'
                });
            }

            // Verificar se o animal existe
            const animal = await Animais.findByPk(id_animais);
            if (!animal) {
                return res.status(404).json({ msg: 'Animal não encontrado' });
            }

            const doacao = await HistoricoAdocoes.create({
                data_resgate: new Date(data_resgate),
                observacoes,
                id_animais,
                id_usuario: (req as any).user.id // Usuário autenticado
            });

            // Atualizar status do animal para "disponível"
            await Animais.update(
                { status: 'disponível' },
                { where: { id: id_animais } }
            );

            res.status(201).json({
                msg: 'Resgate registrado com sucesso! O animal está disponível para adoção.',
                doacao
            });

        } catch (error: any) {
            console.error('Erro ao registrar resgate:', error);

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

    // Registrar adoção (quando o animal é adotado)
    public static async registrarAdocao(req: Request, res: Response) {
        try {
            const {
                id, // ID do registro de resgate
                data_adocao,
                observacoes
            } = req.body;

            // Validação dos campos obrigatórios
            if (!id || !data_adocao) {
                return res.status(400).json({
                    msg: 'ID do registro e data da adoção são obrigatórios.'
                });
            }

            // Buscar o registro de resgate
            const doacao = await HistoricoAdocoes.findByPk(id, {
                include: [Animais]
            });

            if (!doacao) {
                return res.status(404).json({ msg: 'Registro de resgate não encontrado' });
            }

            // Verificar se já foi adotado
            if (doacao.data_adocao) {
                return res.status(400).json({
                    msg: 'Este animal já foi adotado anteriormente.'
                });
            }

            // Atualizar com data de adoção
            await HistoricoAdocoes.update(
                {
                    data_adocao: new Date(data_adocao),
                    observacoes: observacoes || doacao.observacoes,
                    id_usuario: (req as any).user.id // Usuário que está realizando a adoção
                },
                { where: { id } }
            );

            // Atualizar status do animal para "adotado"
            await Animais.update(
                { status: 'adotado' },
                { where: { id: doacao.id_animais } }
            );

            const doacaoAtualizada = await HistoricoAdocoes.findByPk(id, {
                include: [Animais, Usuario]
            });

            res.status(200).json({
                msg: 'Adoção registrada com sucesso!',
                doacao: doacaoAtualizada
            });

        } catch (error: any) {
            console.error('Erro ao registrar adoção:', error);

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

    // Atualizar observações de uma adoção
    public static async updateObservacoes(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { observacoes } = req.body;

            const doacao = await HistoricoAdocoes.findByPk(id);
            if (!doacao) {
                return res.status(404).json({ msg: 'Registro de adoção não encontrado' });
            }

            await HistoricoAdocoes.update(
                { observacoes },
                { where: { id } }
            );

            const doacaoAtualizada = await HistoricoAdocoes.findByPk(id);

            res.status(200).json({
                msg: 'Observações atualizadas com sucesso!',
                doacao: doacaoAtualizada
            });

        } catch (error: any) {
            console.error('Erro ao atualizar observações:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Deletar registro de adoção (apenas para administradores)
    public static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const doacao = await HistoricoAdocoes.findByPk(id);
            if (!doacao) {
                return res.status(404).json({ msg: 'Registro de adoção não encontrado' });
            }

            await HistoricoAdocoes.destroy({ where: { id } });

            res.status(200).json({
                msg: 'Registro de adoção deletado com sucesso!',
                doacaoDeletada: doacao
            });

        } catch (error: any) {
            console.error('Erro ao deletar adoção:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Estatísticas de adoções
    public static async getEstatisticas(req: Request, res: Response) {
        try {
            const totalAdocoes = await HistoricoAdocoes.count();

            const adocoesConcluidas = await HistoricoAdocoes.count({
                where: {
                    data_adocao: {
                        [Op.not]: null as any
                    }
                }
            });

            const animaisDisponiveis = await Animais.count({
                where: { status: 'disponível' }
            });

            
            const totalAdocoesNum = Number(totalAdocoes);
            const adocoesConcluidasNum = Number(adocoesConcluidas);

            const taxaAdocao = totalAdocoesNum > 0
                ? (adocoesConcluidasNum / totalAdocoesNum * 100).toFixed(2)
                : '0';

            res.status(200).json({
                msg: "Estatísticas obtidas com sucesso.",
                estatisticas: {
                    totalAdocoes: totalAdocoesNum,
                    adocoesConcluidas: adocoesConcluidasNum,
                    animaisDisponiveis: Number(animaisDisponiveis),
                    taxaAdocao
                }
            });

        } catch (error: any) {
            console.error('Erro ao obter estatísticas:', error);
            res.status(500).json({
                msg: "Erro interno do servidor",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}