import { FilterQuery, Types } from 'mongoose';
import Todo, { ITodo, Priority } from '../models/Todo';

export interface CreateTodoDTO {
  title: string;
  description?: string;
  dueDate?: string | Date | null;
  completed?: boolean;
  priority?: Priority;
}

export interface UpdateTodoDTO {
  title: string;
  description?: string;
  dueDate?: string | Date | null;
  completed: boolean;
  priority: Priority;
}

export interface PartialUpdateTodoDTO {
  title?: string;
  description?: string;
  dueDate?: string | Date | null;
  completed?: boolean;
  priority?: Priority;
}

export interface ListQuery {
  completed?: string; // 'true' | 'false'
  priority?: Priority;
  title?: string; // substring match
  dueFrom?: string; // ISO date
  dueTo?: string; // ISO date
}

class TodoService {
  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }
    return new Types.ObjectId(id);
  }

  async create(userId: string, data: CreateTodoDTO): Promise<ITodo> {
    const dueDate = data.dueDate ? new Date(data.dueDate) : null;

    const todo = await Todo.create({
      user: this.toObjectId(userId),
      title: data.title,
      description: data.description ?? '',
      dueDate,
      completed: data.completed ?? false,
      priority: data.priority ?? 'medium',
    });

    console.log(`📝 Todo criado: ${todo.id} por usuário ${userId}`);
    return todo;
  }

  async list(userId: string, query: ListQuery): Promise<ITodo[]> {
    const filter: FilterQuery<ITodo> = { user: this.toObjectId(userId) };

    if (typeof query.completed === 'string') {
      if (query.completed === 'true' || query.completed === 'false') {
        filter.completed = query.completed === 'true';
      }
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.dueFrom || query.dueTo) {
      filter.dueDate = {} as any;
      if (query.dueFrom) (filter.dueDate as any).$gte = new Date(query.dueFrom);
      if (query.dueTo) (filter.dueDate as any).$lte = new Date(query.dueTo);
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    console.log(`📋 Listados ${todos.length} todos para usuário ${userId}`);
    return todos;
  }

  async getById(userId: string, todoId: string): Promise<ITodo | null> {
    const todo = await Todo.findById(this.toObjectId(todoId));
    if (!todo) return null;
    if (todo.user.toString() !== userId) {
      const err = new Error('FORBIDDEN');
      // @ts-ignore sinalizar tipo de erro
      err.code = 403;
      throw err;
    }
    return todo;
  }

  async replace(userId: string, todoId: string, data: UpdateTodoDTO): Promise<ITodo | null> {
    const todo = await Todo.findById(this.toObjectId(todoId));
    if (!todo) return null;
    if (todo.user.toString() !== userId) {
      const err = new Error('FORBIDDEN');
      // @ts-ignore
      err.code = 403;
      throw err;
    }

    todo.title = data.title;
    todo.description = data.description ?? '';
    todo.completed = data.completed;
    todo.priority = data.priority;
    todo.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    await todo.save();
    console.log(`✏️ Todo substituído: ${todo.id} por usuário ${userId}`);
    return todo;
  }

  async updatePartial(userId: string, todoId: string, data: PartialUpdateTodoDTO): Promise<ITodo | null> {
    const todo = await Todo.findById(this.toObjectId(todoId));
    if (!todo) return null;
    if (todo.user.toString() !== userId) {
      const err = new Error('FORBIDDEN');
      // @ts-ignore
      err.code = 403;
      throw err;
    }

    if (data.title !== undefined) todo.title = data.title;
    if (data.description !== undefined) todo.description = data.description;
    if (data.completed !== undefined) todo.completed = data.completed;
    if (data.priority !== undefined) todo.priority = data.priority;
    if (data.dueDate !== undefined) todo.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    await todo.save();
    console.log(`🛠️ Todo atualizado parcialmente: ${todo.id} por usuário ${userId}`);
    return todo;
  }

  async remove(userId: string, todoId: string): Promise<boolean | null> {
    const todo = await Todo.findById(this.toObjectId(todoId));
    if (!todo) return null;
    if (todo.user.toString() !== userId) {
      const err = new Error('FORBIDDEN');
      // @ts-ignore
      err.code = 403;
      throw err;
    }
    await todo.deleteOne();
    console.log(`🗑️ Todo removido: ${todo.id} por usuário ${userId}`);
    return true;
  }
}

export default new TodoService();
