import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './database/connection';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import todoRoutes from './routes/todoRoutes';

// Carrega as variáveis de ambiente
dotenv.config();

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    // CORS
    this.app.use(cors());

    // Parser de JSON
    this.app.use(express.json());

    // Parser de URL encoded
    this.app.use(express.urlencoded({ extended: true }));

    // Log de requisições
    this.app.use((req: Request, res: Response, next) => {
      console.log(`📥 ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Rota de health check
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'API de Autenticação funcionando!',
        version: '1.0.0',
      });
    });

    // Rotas de autenticação
    this.app.use('/', authRoutes);

    // Rotas protegidas
    this.app.use('/', protectedRoutes);

  // Rotas de To-dos (protegidas)
  this.app.use('/', todoRoutes);

    // Rota 404 - Not Found
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
      });
    });
  }

  private async initializeDatabase(): Promise<void> {
    await database.connect();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`\n🚀 Servidor rodando na porta ${this.port}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📍 URL: http://localhost:${this.port}\n`);
    });
  }
}

// Inicia a aplicação
const application = new App();
application.listen();

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default application.app;
