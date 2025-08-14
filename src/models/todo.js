import { Schema, model } from 'mongoose';

const statusHistorySchema = new Schema({
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Re Open'],
    default: 'Pending',
  },
  changedAt: { type: Date, default: Date.now },
  changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updateCount: { type: Number, default: 0 },
});

const todoSchema = new Schema(
  {
    ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    title: { type: String, required: true },
    assinedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    due_date: { type: Date, required: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [
        {
          status: 'Pending',
          changedAt: new Date(),
          changedBy: null,
          updateCount: 0,
        },
      ],
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const TodoModel = model('Todo', todoSchema);
