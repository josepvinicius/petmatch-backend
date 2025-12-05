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
import doacoesRouter from "./src/router/adocoes.rouetr.js";

const app = express();
const port = process.env.PORT || 3000;

// 🔥 CORREÇÃO DO CORS - ADICIONE SEU FRONTEND DA VERCEL
const allowedOrigins = [
  'https://petmatch-frontend2.vercel.app/login',
  'http://localhost:5173',
  'https://petmatch-backend.onrender.com'
];

// Tipagem explícita para resolver erro TypeScript
const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir requisições sem origin (Postman, curl, etc)
    if (!origin) return callback(null, true);
    
    // Verificar se a origem está permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️  Origem bloqueada por CORS:', origin);
      callback(null, true); // ⚠️ TEMPORARIAMENTE: permitir todas para teste
      // Para produção, use: callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Aplicar CORS
app.use(cors(corsOptions));

// Middleware para parsing JSON - SEM DUPLICAÇÃO
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de log para debug
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Rotas
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/animais", animaisRouter);
app.use("/doacoes", doacoesRouter);

// Rota de teste CORS
app.get('/cors-test', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    message: 'CORS está funcionando!',
    yourOrigin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
    try {
      console.log('🔄 Iniciando servidor...');
      console.log('🌐 Origens permitidas:', allowedOrigins);
      
      await testConnection();
      setupAssociations();
      console.log('✅ Associações configuradas');
      
      await sequelize.sync({ force: false });
      console.log('✅ Tabelas sincronizadas');
      
      app.get('/', (req: express.Request, res: express.Response) => {
        res.json({ 
          message: 'API PetMatch Backend',
          status: 'Online',
          database: 'Conectado',
          cors: 'Configurado',
          frontend_url: 'https://petmatch-frontend2.vercel.app'
        });
      });
      
      app.get('/health', (req: express.Request, res: express.Response) => {
        res.json({ 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: 'connected'
        });
      });
      
      app.listen(port, () => {
        console.log(`🚀 Servidor rodando na porta ${port}`);
        console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${port}/health`);
        console.log(`🔗 CORS Test: http://localhost:${port}/cors-test`);
        console.log(`🌐 Frontend: https://petmatch-frontend2.vercel.app`);
        console.log(`📦 Limite de payload: 10MB`);
      });
      
    } catch (error) {
      console.error('❌ Falha ao iniciar servidor:', error);
      process.exit(1);
    }
  };
  
  startServer();
  
  export default app;