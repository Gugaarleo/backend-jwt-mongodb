import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from '../src/routes/authRoutes';
import protectedRoutes from '../src/routes/protectedRoutes';
import todoRoutes from '../src/routes/todoRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com MongoDB (com cache)
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI não definida');
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error);
    throw error;
  }
}

// Middleware de conexão
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao conectar ao banco de dados',
    });
  }
});

// Rotas
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API de Autenticação funcionando!',
    version: '1.0.0',
  });
});

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', todoRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

export default app;
