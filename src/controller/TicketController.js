import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      department,
      priority,
      status,
      dueDate,
    } = req.body;

    const ticket = new Ticket({
      title,
      description,
      assignedTo,
      department,
      priority,
      status,
      dueDate,
      createdBy: req.user.id,
    });

    const saved = await ticket.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error('Create Ticket Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('assignedTo', 'name email department')
      .populate('createdBy', 'name email')
      .populate('comments.author', 'name email');

    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching tickets', error: err.message });
  }
};

// Get tickets assigned to a specific employee (self)
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (tickets.length === 0) {
      return res.status(200).json({ message: 'No tickets assigned', data: [] });
    }

    res.status(200).json({
      message: 'My assigned tickets',
      data: tickets,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch your tickets', error: err.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/TicketController.js
export const addCommentToTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.comments.push({ author: userId, text });
    await ticket.save();

    res
      .status(200)
      .json({ success: true, message: 'Comment added', data: ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to add comment', error: error.message });
  }
};
