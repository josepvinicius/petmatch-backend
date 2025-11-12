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

        const user = await Usuario.create({ nome, email, CPF, senha})

        
    }
    catch (error) {
        res.status(400).send({ msg: error });
    }
}

