import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface PerfilAttributes {
  id: number;
  nome: string;
  descricao: string;
}

interface PerfilCreationAttributes extends Optional<PerfilAttributes, 'id'> {}

class Perfil extends Model<PerfilAttributes, PerfilCreationAttributes> implements PerfilAttributes {
  public id!: number;
  public nome!: string;
  public descricao!: string;
}

Perfil.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Perfil',
  tableName: 'PERFIL',
  timestamps: false
});

export default Perfil;