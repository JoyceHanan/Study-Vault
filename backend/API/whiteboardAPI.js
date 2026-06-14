import exp from "express";
import { WhiteboardModel } from "../models/whiteboardModel.js";
import { NotificationModel } from "../models/notificationModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const whiteboardApp = exp.Router();

// CREATE ROOM
whiteboardApp.post("/create-room", verifyToken, async (req, res) => {
  try {
    const { roomName } = req.body;
    const room = new WhiteboardModel({
      roomName,
      createdBy: req.user.id,
      participants: [req.user.id],
      pendingRequests: [],
    });
    await room.save();
    res.status(201).json({ message: "Room created", payload: room });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Room creation failed" });
  }
});

// GET ALL ROOMS
whiteboardApp.get("/rooms", verifyToken, async (req, res) => {
  try {
    const rooms = await WhiteboardModel.find()
      .populate("createdBy", "name photo")
      .populate("participants", "name photo")
      .populate("pendingRequests", "name photo");
    res.status(200).json({ message: "Rooms fetched", payload: rooms });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Cannot fetch rooms" });
  }
});

// REQUEST TO JOIN — adds user to pendingRequests
whiteboardApp.post("/request-join/:id", verifyToken, async (req, res) => {
  try {
    const room = await WhiteboardModel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const userId = req.user.id;

    const alreadyParticipant = room.participants
      .map((p) => p.toString())
      .includes(userId);
    if (alreadyParticipant)
      return res.status(400).json({ message: "Already a participant" });

    const alreadyPending = room.pendingRequests
      .map((p) => p.toString())
      .includes(userId);
    if (alreadyPending)
      return res.status(400).json({ message: "Request already sent" });

    room.pendingRequests.push(userId);
    await room.save();

    // Notify room creator
    await NotificationModel.create({
      userId: room.createdBy,
      message: `Someone requested to join your room "${room.roomName}"`,
    });

    res.status(200).json({ message: "Join request sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Request failed" });
  }
});

// ACCEPT JOIN REQUEST — creator only
whiteboardApp.post("/accept/:id/:userId", verifyToken, async (req, res) => {
  try {
    const room = await WhiteboardModel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const targetId = req.params.userId;

    room.pendingRequests = room.pendingRequests.filter(
      (p) => p.toString() !== targetId
    );
    if (!room.participants.map((p) => p.toString()).includes(targetId)) {
      room.participants.push(targetId);
    }
    await room.save();

    // Notify the accepted user
    await NotificationModel.create({
      userId: targetId,
      message: `Your request to join "${room.roomName}" was accepted!`,
    });

    res.status(200).json({ message: "User accepted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Accept failed" });
  }
});

// DENY JOIN REQUEST — creator only
whiteboardApp.post("/deny/:id/:userId", verifyToken, async (req, res) => {
  try {
    const room = await WhiteboardModel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const targetId = req.params.userId;

    room.pendingRequests = room.pendingRequests.filter(
      (p) => p.toString() !== targetId
    );
    await room.save();

    // Notify the denied user
    await NotificationModel.create({
      userId: targetId,
      message: `Your request to join "${room.roomName}" was declined.`,
    });

    res.status(200).json({ message: "User denied" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Deny failed" });
  }
});

// LEAVE ROOM
whiteboardApp.post("/leave/:id", verifyToken, async (req, res) => {
  try {
    const room = await WhiteboardModel.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Creator cannot leave — they must delete the room
    if (room.createdBy.toString() === req.user.id)
      return res.status(400).json({ message: "Creator cannot leave the room" });

    room.participants = room.participants.filter(
      (p) => p.toString() !== req.user.id
    );
    await room.save();

    res.status(200).json({ message: "Left the room" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Leave failed" });
  }
});