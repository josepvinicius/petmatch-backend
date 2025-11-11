import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface AnimaisAttributes {
  id: number;
  nome: string;
  especie: string;
  faca: string;
  sexo: string;
  nascimento: Date;
  porte: string;
  saude: string;
  status: string;
}

interface AnimaisCreationAttributes extends Optional<AnimaisAttributes, 'id'> {}

class Animais extends Model<AnimaisAttributes, AnimaisCreationAttributes> implements AnimaisAttributes {
  public id!: number;
  public nome!: string;
  public especie!: string;
  public faca!: string;
  public sexo!: string;
  public nascimento!: Date;
  public porte!: string;
  public saude!: string;
  public status!: string;
}

Animais.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  especie: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  faca: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  sexo: {
    type: DataTypes.STRING(9),
    allowNull: false
  },
  nascimento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  porte: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  saude: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(13),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Animais',
  tableName: 'ANIMAIS',
  timestamps: false
});

export default Animais;