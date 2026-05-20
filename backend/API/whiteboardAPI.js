import exp from "express";
import { WhiteboardModel } from "../model/whiteboardModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
export const whiteboardApp = exp.Router();
// Create room
whiteboardApp.post("/create-room",verifyToken,async(req,res)=>{
    try{
        const {roomName}=req.body;
        const room=new WhiteboardModel({roomName,createdBy:req.user.id,participants:[req.user.id]});
        await room.save();
        res.status(201).json({message:"Room created",payload:room});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Room creation failed"});
    }
});
// Get all rooms
whiteboardApp.get("/rooms",verifyToken,async(req,res)=>{
    try{
        const rooms=await WhiteboardModel.find().populate("createdBy","name photo");
        res.status(200).json({message:"Rooms fetched",payload:rooms});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Cannot fetch rooms"});
    }
});
// Join room
whiteboardApp.post("/join/:id",verifyToken,async(req,res)=>{
    try{
        const room=await WhiteboardModel.findById(req.params.id);
        if(!room){
            return res.status(404).json({message:"Room not found"});
        }
        if(!room.participants.includes(req.user.id)){
            room.participants.push(req.user.id);
            await room.save();
        }
        res.status(200).json({message:"Joined room",payload:room});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Join failed"});
}
});