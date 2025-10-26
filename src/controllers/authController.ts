import { Request, Response } from 'express';
import authService from '../services/authService';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validação de requisição mal formatada
      if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        console.log('❌ Requisição mal formatada no registro');
        res.status(400).json({
          success: false,
          message: 'Requisição mal formatada. Verifique os campos enviados.',
        });
        return;
      }

  const result = await authService.register({ name, email, password });

      if (!result.success) {
        // Determina o status code apropriado baseado na mensagem
        let statusCode = 400;
        if (result.message.includes('já cadastrado')) {
          statusCode = 409; // Conflict
        }

        res.status(statusCode).json(result);
        return;
      }

  // Garantir que o registro NUNCA retorne token
  const { success, message, user } = result;
  res.status(201).json({ success, message, user });
    } catch (error) {
      console.error('❌ Erro no controller de registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validação de requisição mal formatada
      if (typeof email !== 'string' || typeof password !== 'string') {
        console.log('❌ Requisição mal formatada no login');
        res.status(400).json({
          success: false,
          message: 'Requisição mal formatada. Verifique os campos enviados.',
        });
        return;
      }

      const result = await authService.login({ email, password });

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('❌ Erro no controller de login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}

export default new AuthController();
