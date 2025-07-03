import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    // teamAssignment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    department: { type: String, required: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //this
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Under Review', 'Resolved', 'Closed'],
      default: 'Open',
    },
    comments: [
      //this
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    dueDate: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', ticketSchema);
