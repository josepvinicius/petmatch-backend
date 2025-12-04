import "dotenv/config";
import cors from 'cors';
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

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 🔥 SOLUÇÃO: AUMENTE O LIMITE DO JSON PARSER
app.use(express.json({ limit: '10mb' })); // ← MUDE ESTA LINHA
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // ← ADICIONE ESTA LINHA

// Se estiver usando body-parser (opcional, mas recomendado)
import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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
        console.log(`📦 Limite de payload configurado para: 10MB`);
      });
      
    } catch (error) {
      console.error('❌ Falha ao iniciar servidor:', error);
      process.exit(1);
    }
  };
  
  // Iniciar tudo
  startServer();
  
  export default app;