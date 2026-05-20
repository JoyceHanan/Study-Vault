import exp from "express";
import {BookmarkModel} from "../models/bookmarkModel.js";
import {verifyToken} from "../middleware/verifyToken.js";
export const bookmarkApp = exp.Router();
// ADD BOOKMARK
bookmarkApp.post("/add",verifyToken,async(req,res)=>{
    try {
        const {resourceId}=req.body;
        const alreadyBookmarked=await BookmarkModel.findOne({userId:req.user.id,resourceId});
        if (alreadyBookmarked) {
            return res.status(400).json({message:"Resource already bookmarked"});
        }
        const bookmarkDoc=new BookmarkModel({userId:req.user.id,resourceId});
        await bookmarkDoc.save();
        res.status(201).json({ message:"Resource bookmarked",payload:bookmarkDoc});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Bookmark failed"});
    }
});
// REMOVE BOOKMARK
bookmarkApp.delete("/remove/:resourceId",verifyToken,async(req,res)=>{
        try{
            const bookmark=await BookmarkModel.findOneAndDelete({userId:req.user.id,resourceId:req.params.resourceId});
            if(!bookmark){
                return res.status(404).json({message:"Bookmark not found"});
            }
            res.status(200).json({message:"Bookmark removed"});

        }
        catch(err){
            console.log(err);
            res.status(500).json({message:"Remove failed"});
        }
    }
);
// GET ALL BOOKMARKS OF CURRENT USER
bookmarkApp.get("/",verifyToken,async(req,res)=>{
    try{
        const bookmarks=await BookmarkModel.find({userId:req.user.id}).populate({
            path:"resourceId",
            populate:{
                path:"uploadedBy",
                select:"name email"
            }
        });
        res.status(200).json({message:"Bookmarks fetched",payload:bookmarks});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Cannot fetch bookmarks"});
    }
});