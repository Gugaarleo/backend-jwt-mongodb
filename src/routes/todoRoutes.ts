import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import todoController from '../controllers/todoController';

const router = Router();

// Todas as rotas abaixo são protegidas por JWT
router.post('/todos', authMiddleware, (req, res) => todoController.create(req, res));
router.get('/todos', authMiddleware, (req, res) => todoController.list(req, res));
router.get('/todos/:id', authMiddleware, (req, res) => todoController.getById(req, res));
router.put('/todos/:id', authMiddleware, (req, res) => todoController.replace(req, res));
router.patch('/todos/:id', authMiddleware, (req, res) => todoController.updatePartial(req, res));
router.delete('/todos/:id', authMiddleware, (req, res) => todoController.remove(req, res));

export default router;
