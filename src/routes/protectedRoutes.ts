import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// GET /protected - Rota protegida que requer autenticação
router.get('/protected', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Acesso autorizado',
    userId: req.userId,
  });
});

export default router;
