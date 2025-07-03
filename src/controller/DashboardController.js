import Ticket from '../models/Ticket.js';

export const getDashboardStats = async (req, res) => {
  try {
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'Open' });
    const resolved = await Ticket.countDocumnts({ status: 'Resolved' });
    const inProgress = await Ticket.countDocuments({ status: 'In Progress' });

    res.json({
      total,
      open,
      resolved,
      inProgress,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

