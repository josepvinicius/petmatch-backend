import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';
import bcrypt from 'bcryptjs';

interface UsuarioAttributes {
  id: number;
  nome: string;
  email: string;
  CPF: string;
  senha: string;
  data_cadastro: Date;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id' | 'data_cadastro'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public id!: number;
  public nome!: string;
  public email!: string;
  public CPF!: string;
  public senha!: string;
  public data_cadastro!: Date;
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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