import Usuario from './Usuario.js';
import Contato from './Contato.js';
import Endereco from './Endereco.js';
import Animais from './Animais.js';
import HistoricoAdocoes from './HistoricoAdocoes.js';
import Perfil from './Perfil.js';
import UsuarioPerfil from './UsuarioPerfil.js';

export const setupAssociations = () => {
  // Usuario <-> Contato (1:1)
  Usuario.hasOne(Contato, { foreignKey: 'id_usuario' });
  Contato.belongsTo(Usuario, { foreignKey: 'id_usuario' });

  // Contato <-> Endereco (1:1)
  Contato.hasOne(Endereco, { foreignKey: 'id_contato' });
  Endereco.belongsTo(Contato, { foreignKey: 'id_contato' });

  // Usuario <-> HistoricoAdocoes (1:N)
  Usuario.hasMany(HistoricoAdocoes, { foreignKey: 'id_usuario' });
  HistoricoAdocoes.belongsTo(Usuario, { foreignKey: 'id_usuario' });

  // Animais <-> HistoricoAdocoes (1:N)
  Animais.hasMany(HistoricoAdocoes, { foreignKey: 'id_animais' });
  HistoricoAdocoes.belongsTo(Animais, { foreignKey: 'id_animais' });

  // Usuario <-> Perfil (N:M através de UsuarioPerfil)
  Usuario.belongsToMany(Perfil, { 
    through: UsuarioPerfil, 
    foreignKey: 'id_usuario' 
  });
  Perfil.belongsToMany(Usuario, { 
    through: UsuarioPerfil, 
    foreignKey: 'id_perfil' 
  });
};