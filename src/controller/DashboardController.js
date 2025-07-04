import Ticket from '../models/Ticket.js';

export const getDashboardStats = async (req, res) => {
  try {
    const role = req?.user?.role !== 'admin';
    const data = await Ticket.find(role ? { assignedTo: req?.user?._id } : {});
    const total = data.length;
    const open = data.filter((item) => item.status === 'Open').length;
    const resolved = data.filter((item) => item.status === 'Resolved').length;
    const inProgress = data.filter(
      (item) => item.status === 'In Progress'
    ).length;

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
      