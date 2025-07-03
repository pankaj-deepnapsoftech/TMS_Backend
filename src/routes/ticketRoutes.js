import express from 'express';
import {
  createTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
  addCommentToTicket,
  getMyTickets,
} from '../controller/TicketController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTicket);
router.get('/', authMiddleware, getAllTickets);
router.get('/my', authMiddleware, getMyTickets);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);
router.put('/:ticketId/comment', authMiddleware, addCommentToTicket);

export default router;
