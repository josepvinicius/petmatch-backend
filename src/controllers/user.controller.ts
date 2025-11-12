import Usuario from "../model/Usuario.js";
import type { Request, Response } from "express";

async function findAll(req: Request, res: Response) {
    try {
        const user = await Usuario.findAll();
        res.status(200).send({ msg: "Usuários Listados.", user});
    }
    catch (error) {
        res.status(400).send({ msg: error });
    }
}

async function findById(req: Request, res: Response) {
    try{
        const {id} = req.params
        const user = await Usuario.findByPk(id);

        res.status(200).send({ msg: user});
    }
    catch (error) {
        res.status(400).send({ msg: error });
    }
}

async function removeUser(req: Request, res: Response) {
    try{
        const {id} = req.params
        const user = await Usuario.destroy({where: {id}});

        res.status(200).send({ msg: 'Usuário deletado com sucesso.'});
    }
    catch (error) {
        res.status(400).send({ msg: error });
    }
}

async function createUser(req: Request, res: Response) {
    try{
        const { nome ,email, CPF, senha } = req.params;

        if(!nome || !email || !CPF || senha){
            res.status(400).send({ msg: 'Todos os campos são obrigatorios.'});
        }

        const user = await Usuario.create({ nome: nome!, email: email!, CPF: CPF!, senha: senha!})

        
    }
    catch (error) {
        res.status(400).send({ msg: error });
    }
}

async function updateUser(req: Request, res: Response) {
    try{
        const { id } = req.params;
        const { nome, email, CPF } = req.body
        
        if(!nome && !email && !CPF){
            res.status(400).send({ msg: 'Nenhum campo foi alterado para ser atualizado!'});
        }

        const updateData: any = {}
        if(nome) updateData.nome = nome;
        if(email) updateData.email = email;
        if(CPF) updateData.CPF = CPF;

        const [affectedCount] = await Usuario.update(updateData, { 
            where: {id: id}
        });

        if (affectedCount === 0 ){
            res.status(404).send({ msg: 'Usuario não encontrado!'});
        }

        res.status(200).send({ msg: 'Alterações salvas com sucesso!'});
    }
    catch (error) {
        res.status(400).send({ msg: error })
    }
}

export default { findAll, findById, removeUser, createUser, updateUser};