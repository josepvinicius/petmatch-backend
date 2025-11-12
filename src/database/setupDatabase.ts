import { sequelize, testConnection } from './db.js';

// Importar TODOS os models - IMPORTANTE!
import '../model/Usuario.js';
import '../model/Contato.js';
import '../model/Endereco.js';
import '../model/Animais.js';
import '../model/HistoricoAdocoes.js';
import '../model/Perfil.js';
import '../model/UsuarioPerfil.js';

// Importar e executar associações
import { setupAssociations } from '../model/associations.js';

const initializeDatabase = async () => {
  try {
    console.log('🔄 Iniciando configuração do banco de dados...');
    
    // 1. Testar conexão
    await testConnection();
    
    // 2. Configurar associações
    setupAssociations();
    console.log('✅ Associações configuradas');
    
    // 3. Sincronizar modelos (cria as tabelas)
    await sequelize.sync({ force: false });
    console.log('✅ Tabelas criadas/sincronizadas com sucesso!');
    
    console.log('🎉 Banco de dados inicializado com sucesso!');
    
  } catch (error) {
    console.error('❌ Falha na inicialização do banco:', error);
    process.exit(1);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;