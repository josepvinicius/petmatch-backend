import { DataTypes, Model} from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface HistoricoAdocoesAttributes {
  id: string;
  data_resgate: Date;
  data_adocao?: Date;
  observacoes?: string;
  id_usuario: number;
  id_animais: number;
}

interface HistoricoAdocoesCreationAttributes extends Optional<HistoricoAdocoesAttributes, 'id' | 'data_adocao' | 'observacoes'> {}

class HistoricoAdocoes extends Model<HistoricoAdocoesAttributes, HistoricoAdocoesCreationAttributes> implements HistoricoAdocoesAttributes {
  public id!: string;
  public data_resgate!: Date;
  public data_adocao?: Date;
  public observacoes?: string;
  public id_usuario!: number;
  public id_animais!: number;
}

HistoricoAdocoes.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  data_resgate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_adocao: {
    type: DataTypes.DATE,
    allowNull: true
  },
  observacoes: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  id_usuario: {
    type: DataTypes.UUID,
    allowNull: false
  },
  id_animais: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'HistoricoAdocoes',
  tableName: 'HISTORICO_ADOCOES',
  timestamps: false
});

export default HistoricoAdocoes;