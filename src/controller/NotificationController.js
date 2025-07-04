import Notification from '../models/Notification.js';

// Get all notifications for a user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching notifications' });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification || String(notification.user) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating notification' });
  }
};
