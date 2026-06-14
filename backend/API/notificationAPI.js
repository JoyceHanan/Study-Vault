import exp from "express";
import { NotificationModel } from "../models/notificationModel.js";
import { WhiteboardModel } from "../models/whiteboardModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const notificationApp = exp.Router();

// GET ALL NOTIFICATIONS OF CURRENT USER
notificationApp.get("/", verifyToken, async (req, res) => {
  try {
    const notifications = await NotificationModel.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Notifications fetched", payload: notifications });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Cannot fetch notifications" });
  }
});

// MARK NOTIFICATION AS READ
notificationApp.put("/mark-read/:id", verifyToken, async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    if (notification.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: "Marked as read", payload: notification });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
});

// NOTIFY ALL ROOM PARTICIPANTS when a resource is shared in a room
notificationApp.post("/room-share", verifyToken, async (req, res) => {
  try {
    const { roomId, resourceId, title } = req.body;
    const room = await WhiteboardModel.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const senderId = req.user.id;

    // Notify everyone in the room except the sender
    const targets = room.participants.filter(
      (p) => p.toString() !== senderId
    );

    await Promise.all(
      targets.map((userId) =>
        NotificationModel.create({
          userId,
          message: `A resource "${title}" was shared in room "${room.roomName}"`,
        })
      )
    );

    res.status(200).json({ message: "Room participants notified" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Notification failed" });
  }
});