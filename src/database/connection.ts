import mongoose from 'mongoose';

class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
      }

      console.log('🔄 Conectando ao MongoDB...');
      
      await mongoose.connect(mongoUri);
      
      console.log('✅ MongoDB conectado com sucesso!');
      
      mongoose.connection.on('error', (error) => {
        console.error('❌ Erro na conexão com MongoDB:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB desconectado');
      });

    } catch (error) {
      console.error('❌ Erro ao conectar ao MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('MongoDB desconectado');
    } catch (error) {
      console.error('Erro ao desconectar do MongoDB:', error);
    }
  }
}

export default Database.getInstance();
