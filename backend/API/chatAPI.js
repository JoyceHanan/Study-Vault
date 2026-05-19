import exp from "express";
import {ChatModel} from "../model/chatModel.js";
import {verifyToken} from "../middleware/verifyToken.js";
export const chatApp = exp.Router();
// SEND MESSAGE
chatApp.post("/send",verifyToken,async(req,res)=>{
    try{
        const {roomId,message}=req.body;
        const chatDoc=new ChatModel({roomId,message,sender: req.user.id});
        await chatDoc.save();
        const populatedChat=await ChatModel.findById(chatDoc._id).populate("sender", "name photo");
        res.status(201).json({message:"Message sent",payload:populatedChat});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to send message"});
    }
})
// GET CHAT HISTORY OF A ROOM
chatApp.get("/:roomId",verifyToken,async(req,res)=>{
    try {
        const chats=await ChatModel.find({roomId:req.params.roomId}).populate("sender","name photo").sort({createdAt:1});
        res.status(200).json({message:"Chat history",payload:chats});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Cannot fetch chats"});
    }
});
// DELETE MESSAGE
chatApp.delete("/:messageId",verifyToken,async(req,res)=>{
    try {
        const chat=await ChatModel.findById(req.params.messageId);
        if(!chat){
            return res.status(404).json({message:"Message not found"});
        }
        if(chat.sender.toString() !== req.user.id){
            return res.status(403).json({message:"Unauthorized"});
        }
        await ChatModel.findByIdAndDelete(req.params.messageId);
        res.status(200).json({message:"Message deleted"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Delete failed"});
    }
});