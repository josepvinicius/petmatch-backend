import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';
import bcrypt from 'bcryptjs';

interface UsuarioAttributes {
  id: string | undefined;
  nome: string;
  email: string;
  CPF: string;
  senha: string;
  data_cadastro: Date | undefined;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id' | 'data_cadastro'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  declare id: string | undefined;
  declare nome: string;
  declare email: string;
  declare CPF: string;
  declare senha: string;
  declare data_cadastro: Date | undefined;
}

Usuario.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  CPF: {
    type: DataTypes.STRING(14),
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  data_cadastro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'USUARIO',
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario: Usuario) => {
      console.log(usuario)
      const salt = await bcrypt.genSalt(12);
      usuario.senha = await bcrypt.hash(usuario.senha, salt);
    },
    beforeUpdate: async (usuario: Usuario) => {
      if (usuario.changed('senha')) {
        const salt = await bcrypt.genSalt(12);
        usuario.senha = await bcrypt.hash(usuario.senha, salt);
      }
    }
  }
});

export default Usuario;