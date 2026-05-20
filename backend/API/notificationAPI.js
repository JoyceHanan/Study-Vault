import exp from "express";
import {NotificationModel} from "../model/notificationModel.js";
import {verifyToken} from "../middleware/verifyToken.js";
export const notificationApp = exp.Router();
// GET ALL NOTIFICATIONS OF CURRENT USER
notificationApp.get("/",verifyToken,async(req,res)=>{
    try {
        const notifications=await NotificationModel.find({userId: req.user.id}).sort({ createdAt: -1 });
        res.status(200).json({message:"Notifications fetched",payload:notifications});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Cannot fetch notifications"});
    }
});
// MARK NOTIFICATION AS READ
notificationApp.put("/mark-read/:id",verifyToken,async(req,res)=>{
        try{
            const notification=await NotificationModel.findById(req.params.id);
            if(!notification){
                return res.status(404).json({message:"Notification not found"});
            }
            if(notification.userId.toString()!==req.user.id){
                return res.status(403).json({message:"Unauthorized"});
            }
            notification.isRead=true;
            await notification.save();
            res.status(200).json({message:"Notification marked as read",payload:notification});
        }
        catch(err){
            console.log(err);
            res.status(500).json({message:"Update failed"});
        }
    }
);