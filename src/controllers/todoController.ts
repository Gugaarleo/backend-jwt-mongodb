import { Request, Response } from 'express';
import todoService, { CreateTodoDTO, ListQuery, PartialUpdateTodoDTO, UpdateTodoDTO } from '../services/todoService';

class TodoController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const body = req.body as CreateTodoDTO;

      if (!body || typeof body.title !== 'string') {
        res.status(400).json({ success: false, message: 'Campo "title" é obrigatório e deve ser uma string' });
        return;
      }

      const todo = await todoService.create(userId, body);
      res.status(201).json({ success: true, data: todo });
    } catch (error: any) {
      console.error('❌ Erro ao criar Todo:', error);
      res.status(500).json({ success: false, message: 'Erro ao criar todo' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const query = req.query as unknown as ListQuery;
      const todos = await todoService.list(userId, query);
      res.status(200).json({ success: true, data: todos });
    } catch (error) {
      console.error('❌ Erro ao listar Todos:', error);
      res.status(500).json({ success: false, message: 'Erro ao listar todos' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      try {
        const todo = await todoService.getById(userId, id);
        if (!todo) {
          res.status(404).json({ success: false, message: 'Todo não encontrado' });
          return;
        }
        res.status(200).json({ success: true, data: todo });
      } catch (err: any) {
        if (err?.code === 403) {
          res.status(403).json({ success: false, message: 'Acesso negado a recurso de outro usuário' });
          return;
        }
        if (err?.message === 'ID inválido') {
          res.status(400).json({ success: false, message: 'ID inválido' });
          return;
        }
        throw err;
      }
    } catch (error) {
      console.error('❌ Erro ao obter Todo por ID:', error);
      res.status(500).json({ success: false, message: 'Erro ao obter todo' });
    }
  }

  async replace(req: Request, res: Response): Promise<void> {
      try {
        const userId = req.userId!;
        const { id } = req.params;
        const body = req.body as UpdateTodoDTO;

        // PUT exige payload completo mínimo
        if (!body || typeof body.title !== 'string' || typeof body.completed !== 'boolean' || typeof body.priority !== 'string') {
          res.status(400).json({ success: false, message: 'Campos obrigatórios: title (string), completed (boolean), priority (low|medium|high)' });
          return;
        }

        try {
          const todo = await todoService.replace(userId, id, body);
          if (!todo) {
            res.status(404).json({ success: false, message: 'Todo não encontrado' });
            return;
          }
          res.status(200).json({ success: true, data: todo });
        } catch (err: any) {
          if (err?.code === 403) {
            res.status(403).json({ success: false, message: 'Acesso negado a recurso de outro usuário' });
            return;
          }
          if (err?.message === 'ID inválido') {
            res.status(400).json({ success: false, message: 'ID inválido' });
            return;
          }
          throw err;
        }
      } catch (error) {
        console.error('❌ Erro ao substituir Todo:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar todo' });
      }
  }

  async updatePartial(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const body = req.body as PartialUpdateTodoDTO;

      if (!body || Object.keys(body).length === 0) {
        res.status(400).json({ success: false, message: 'Informe ao menos um campo para atualização' });
        return;
      }

      try {
        const todo = await todoService.updatePartial(userId, id, body);
        if (!todo) {
          res.status(404).json({ success: false, message: 'Todo não encontrado' });
          return;
        }
        res.status(200).json({ success: true, data: todo });
      } catch (err: any) {
        if (err?.code === 403) {
          res.status(403).json({ success: false, message: 'Acesso negado a recurso de outro usuário' });
          return;
        }
        if (err?.message === 'ID inválido') {
          res.status(400).json({ success: false, message: 'ID inválido' });
          return;
        }
        throw err;
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar parcialmente Todo:', error);
      res.status(500).json({ success: false, message: 'Erro ao atualizar todo' });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      try {
        const removed = await todoService.remove(userId, id);
        if (removed === null) {
          res.status(404).json({ success: false, message: 'Todo não encontrado' });
          return;
        }
        res.status(204).send();
      } catch (err: any) {
        if (err?.code === 403) {
          res.status(403).json({ success: false, message: 'Acesso negado a recurso de outro usuário' });
          return;
        }
        if (err?.message === 'ID inválido') {
          res.status(400).json({ success: false, message: 'ID inválido' });
          return;
        }
        throw err;
      }
    } catch (error) {
      console.error('❌ Erro ao remover Todo:', error);
      res.status(500).json({ success: false, message: 'Erro ao remover todo' });
    }
  }
}

export default new TodoController();
