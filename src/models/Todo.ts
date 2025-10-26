import mongoose, { Document, Schema, Types } from 'mongoose';

export type Priority = 'low' | 'medium' | 'high';

export interface ITodo extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date | null;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [1, 'Título deve ter no mínimo 1 caractere'],
      maxlength: [200, 'Título deve ter no máximo 200 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Descrição deve ter no máximo 2000 caracteres'],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true,
    },
  },
  { timestamps: true }
);

// Índice composto útil para listagens por usuário e ordenações
todoSchema.index({ user: 1, createdAt: -1 });

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;
