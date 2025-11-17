import "dotenv/config";
import express from "express";
import { sequelize, testConnection } from "./src/database/db.js";
import { setupAssociations } from "./src/model/associations.js";

import "./src/model/Usuario.js";
import "./src/model/Contato.js";
import "./src/model/Endereco.js";
import "./src/model/Animais.js";
import "./src/model/HistoricoAdocoes.js";
import "./src/model/Perfil.js";
import "./src/model/UsuarioPerfil.js";

import userRouter from "./src/router/user.router.js";
import authRouter from "./src/router/auth.router.js";
import animaisRouter from "./src/router/animais.router.js";
import doacoesRouter from "./src/router/adocoes.rouetr.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/animais", animaisRouter);
app.use("/doacoes", doacoesRouter);

const startServer = async () => {
    try {
      console.log('🔄 Iniciando servidor...');
      
      // 1. Testar conexão com Supabase
      await testConnection();
      
      // 2. Configurar associações entre models
      setupAssociations();
      console.log('✅ Associações configuradas');
      
      // 3. Sincronizar modelos com o banco (criar tabelas)
      await sequelize.sync({ force: false });
      console.log('✅ Tabelas sincronizadas com o banco');
      
      // 4. Rotas básicas para teste
      app.get('/', (req, res) => {
        res.json({ 
          message: 'API Controle Doações Animais',
          status: 'Online',
          database: 'Conectado'
        });
      });
      
      // Health check
      app.get('/health', (req, res) => {
        res.json({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'connected'
        });
      });
      
      // 5. Iniciar servidor
      app.listen(port, () => {
        console.log(`🚀 Servidor rodando na porta ${port}`);
        console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${port}/health`);
      });
      
    } catch (error) {
      console.error('❌ Falha ao iniciar servidor:', error);
      process.exit(1);
    }
  };
  
  // Iniciar tudo
  startServer();
  
  export default app;
