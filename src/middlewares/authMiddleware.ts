import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

// Estende a interface Request do Express para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('❌ Tentativa de acesso sem token');
      res.status(401).json({
        success: false,
        message: 'Token não fornecido',
      });
      return;
    }

    // O token vem no formato: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      console.log('❌ Token mal formatado');
      res.status(401).json({
        success: false,
        message: 'Token mal formatado',
      });
      return;
    }

    const [scheme, token] = parts;

    // Verifica se o esquema é Bearer
    if (!/^Bearer$/i.test(scheme)) {
      console.log('❌ Esquema de token inválido');
      res.status(401).json({
        success: false,
        message: 'Token mal formatado',
      });
      return;
    }

    // Verifica o token
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      console.log('❌ Token inválido ou expirado');
      res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
      });
      return;
    }

    // Adiciona o userId à requisição
    req.userId = decoded.id;

    console.log(`✅ Token validado para usuário: ${decoded.id}`);

    next();
  } catch (error) {
    console.error('❌ Erro no middleware de autenticação:', error);
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};
