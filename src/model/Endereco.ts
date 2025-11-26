import { DataTypes, Model} from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface EnderecoAttributes {
  id: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  CEP: string;
  municipio: string;
  uf: string;
  id_contato: number;
}

interface EnderecoCreationAttributes extends Optional<EnderecoAttributes, 'id' | 'complemento'> {}

class Endereco extends Model<EnderecoAttributes, EnderecoCreationAttributes> implements EnderecoAttributes {
  public id!: number;
  public logradouro!: string;
  public numero!: string;
  public complemento!: string;
  public bairro!: string;
  public CEP!: string;
  public municipio!: string;
  public uf!: string;
  public id_contato!: number;
}

Endereco.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  logradouro: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  bairro: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  CEP: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  municipio: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  uf: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  id_contato: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Endereco',
  tableName: 'ENDERECO',
  timestamps: false
});

export default Endereco;