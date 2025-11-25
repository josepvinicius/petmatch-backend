import { Sequelize } from "sequelize";


export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: console.log,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar com Supabase:', error);
        throw error;
    }

};