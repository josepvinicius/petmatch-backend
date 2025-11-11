import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface UsuarioPerfilAttributes {
  id: number;
  id_usuario: number;
  id_perfil: number;
}

interface UsuarioPerfilCreationAttributes extends Optional<UsuarioPerfilAttributes, 'id'> {}

class UsuarioPerfil extends Model<UsuarioPerfilAttributes, UsuarioPerfilCreationAttributes> implements UsuarioPerfilAttributes {
  public id!: number;
  public id_usuario!: number;
  public id_perfil!: number;
}

UsuarioPerfil.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'UsuarioPerfil',
  tableName: 'USUARIO_PERFIL',
  timestamps: false
});

export default UsuarioPerfil;