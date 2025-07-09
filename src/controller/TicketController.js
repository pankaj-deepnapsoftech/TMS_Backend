import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import { io } from '../index.js';

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

    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

    let nextTicketNumber = 'TKT-0001';
    if (lastTicket && lastTicket.ticketNumber) {
      const lastNumber = parseInt(lastTicket.ticketNumber.split('-')[1]);
      const newNumber = lastNumber + 1;
      nextTicketNumber = `TKT-${newNumber.toString().padStart(4, '0')}`;
    }

    const ticket = new Ticket({
      title,
      description,
      assignedTo,
      department,
      priority,
      status,
      dueDate,
      createdBy: req.user.id,
      ticketNumber: nextTicketNumber,
    });

    const saved = await ticket.save();

    // Create notifications and emit socket events
    await Promise.all(
      assignedTo.map(async (userId) => {
        const notification = await Notification.create({
          user: userId,
          sender: req.user.id,
          type: 'ticket',
          message: `New ticket "${title}" has been assigned to you.`,
          ticket: saved._id,
        });

        // Emit socket event to specific user
        io.to(userId.toString()).emit('notification', {
          type: 'ticket',
          message: notification.message,
          ticketId: saved._id,
          ticketNumber: saved.ticketNumber,
        });
      })
    );

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
    
    const { id } = req.params;
    const newData = req.body;

    // Step 1: Get the current ticket with existing assignedTo
    const existingTicket = await Ticket.findById(id);
    if (!existingTicket) {
      return res.status(404).json({ message: 'Ticket not found ' });
    }

    const oldAssigned = existingTicket.assignedTo.map(id => id.toString());
    const newAssigned = newData.assignedTo?.map(id => id.toString()) || [];

    // Step 2: Detect newly added users
    const newlyAssigned = newAssigned.filter(uid => !oldAssigned.includes(uid));

    // Step 3: Update the ticket
    const updated = await Ticket.findByIdAndUpdate(id, newData, { new: true });

    // Step 4: Notify newly assigned users
    if (newlyAssigned.length > 0) {
      await Promise.all(
        newlyAssigned.map((userId) =>
          Notification.create({
            user: userId,
            sender: req.user.id,
            type: 'ticket',
            message: `You have been added to ticket "${updated.title}".`,
            ticket: updated._id,
          })
        )
      );
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('Update Ticket Error:', err);
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

export const addCommentToTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    // First: Find ticket (no populate yet)
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Add new comment
    ticket.comments.push({ author: userId, text });
    const data = await ticket.save();

    // Now: Re-fetch ticket with populated fields (important!)
    const updatedTicket = await Ticket.findById(ticketId)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.author', 'name email');

    io.emit('ticket', updatedTicket);

    // Create notifications
    const notifyUserIds = ticket.assignedTo
      .filter((member) => member.toString() !== userId)
      .map((member) => member.toString());

    if (ticket.createdBy.toString() !== userId) {
      notifyUserIds.push(ticket.createdBy.toString());
    }

    const notifications = notifyUserIds.map((uid) => ({
      user: uid, // receiver
      sender: userId, // person who commented
      type: 'comment',
      message: `New comment on ticket "${ticket.title}"`,
      ticket: ticket._id,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: 'Comment added and notifications sent',
      data: updatedTicket, // send re-populated ticket
    });

  } catch (error) {
    console.error('Add Comment Error:', error);
    res.status(500).json({
      message: 'Failed to add comment',
      error: error.message,
    });
  }
};
