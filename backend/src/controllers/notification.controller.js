import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Get all users except the current user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .sort({ fullName: 1 });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsers controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { title, message, type, priority, recipientType, selectedUsers } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    let recipients = [];

    // Determine recipients based on recipientType
    if (recipientType === "all") {
      // Get all users except the sender
      recipients = await User.find({ _id: { $ne: senderId } }).select("_id");
      recipients = recipients.map(user => user._id);
    } else if (recipientType === "contributors") {
      // For now, treating contributors as all users except sender
      // You can add specific logic here based on your user model
      recipients = await User.find({ _id: { $ne: senderId } }).select("_id");
      recipients = recipients.map(user => user._id);
    } else if (recipientType === "specific") {
      if (!selectedUsers || selectedUsers.length === 0) {
        return res.status(400).json({ error: "Please select at least one user" });
      }
      recipients = selectedUsers;
    }

    // Create notifications for each recipient
    const notifications = [];
    for (const recipientId of recipients) {
      const notification = new Notification({
        title,
        message,
        type: type || "code_share",
        priority: priority || "medium",
        recipient: recipientId,
        sender: senderId,
        read: false
      });

      await notification.save();

      // Populate sender and recipient info
      await notification.populate("sender", "fullName profilePic");
      await notification.populate("recipient", "fullName profilePic");

      notifications.push(notification);

      // Send real-time notification via socket
      const receiverSocketId = getReceiverSocketId(recipientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
      }
    }

    res.status(201).json({
      message: "Notification sent successfully",
      notificationsSent: notifications.length,
      notifications: notifications
    });

  } catch (error) {
    console.error("Error in sendNotification controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get notifications where the current user is the recipient
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "fullName profilePic")
      .populate("recipient", "fullName profilePic")
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in getNotifications controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { read } = req.body;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Check if the current user is the recipient
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to update this notification" });
    }

    notification.read = read;
    await notification.save();

    res.status(200).json({
      message: "Notification updated successfully",
      notification
    });
  } catch (error) {
    console.error("Error in markAsRead controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({ 
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error in markAllAsRead controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this notification" });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};