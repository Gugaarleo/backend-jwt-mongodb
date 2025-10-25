import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

// POST /register - Registro de novo usuário
router.post('/register', authController.register);

// POST /login - Login de usuário
router.post('/login', authController.login);

export default router;
