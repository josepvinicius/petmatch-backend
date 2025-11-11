import { DataTypes, Model} from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface ContatoAttributes {
  id: number;
  fone: string;
  email: string;
  id_usuario: number;
}

interface ContatoCreationAttributes extends Optional<ContatoAttributes, 'id'> {}

class Contato extends Model<ContatoAttributes, ContatoCreationAttributes> implements ContatoAttributes {
  public id!: number;
  public fone!: string;
  public email!: string;
  public id_usuario!: number;
}

Contato.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fone: {
    type: DataTypes.STRING(11),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Contato',
  tableName: 'CONTATO',
  timestamps: false
});

export default Contato;