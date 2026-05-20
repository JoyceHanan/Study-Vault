import exp from "express";
import {ReportModel} from "../models/reportModel.js";
import {verifyToken} from "../middleware/verifyToken.js";
export const reportApp = exp.Router();
// Create report
reportApp.post("/create",verifyToken,async(req,res)=>{
    try{
        const reportDoc=new ReportModel({reportedBy:req.user.id,resourceId:req.body.resourceId,doubtId:req.body.doubtId,reason:req.body.reason});
        await reportDoc.save();
        res.status(201).json({message:"Report submitted",payload:reportDoc});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Report failed"});
    }
});
// Get all reports
reportApp.get("/",verifyToken,async(req,res)=>{
    try{
        const reports=await ReportModel.find().populate("reportedBy","name email");
        res.status(200).json({message:"Reports fetched",payload:reports});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Cannot fetch reports"});
    }
});