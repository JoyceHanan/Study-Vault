import exp from "express"
import {DoubtModel} from "../model/doubtModel.js"
import {verifyToken} from "../middleware/verifyToken.js"
export const doubtApp=exp.Router()
//CREATE DOUBT
doubtApp.post("/create",verifyToken,async(req,res)=>{
    try{
        const newDoubt=req.body
        newDoubt.askedBy=req.user.id
        const doubtDoc=new DoubtModel(newDoubt)
        await doubtDoc.save()
        res.status(201).json({message:"Doubt created",payload:doubtDoc})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Error creating doubt"})
    }
})
//GET ALL DOUBTS
doubtApp.get("/",async(req,res)=>{
    try{
        const doubts=await DoubtModel.find().populate("askedBy","name email")
        res.status(200).json({message:"Doubts fetched",payload:doubts})
    }
    catch(err){
        res.status(500).json({message:"Cannot fetch doubts"})
    }
})
//GET DOUBT BY ID
doubtApp.get("/:id",async(req,res)=>{
    try{
        const doubt=await DoubtModel.findById(req.params.id).populate("askedBy","name email")
        if(!doubt){
            return res.status(404).json({message:"Doubt not found"})
        }
        res.status(200).json({payload:doubt})
    }
    catch(err){
        res.status(500).json({message:"Error fetching doubt"})
    }
})
//REPLY TO DOUBT
doubtApp.post("/reply/:id",verifyToken,async(req,res)=>{
    try{
        const {message}=req.body
        const doubt=await DoubtModel.findById(req.params.id)
        if(!doubt){
            return res.status(404).json({message:"Doubt not found"})
        }
        doubt.answers.push({user:req.user.id,message})
        await doubt.save()
        res.status(200).json({message:"Reply added"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Reply failed"})
    }
})
//MARK AS SOLVED
doubtApp.put("/solve/:id",verifyToken,async(req,res)=>{
    try{
        const doubt=await DoubtModel.findById(req.params.id)
        if(!doubt){
            return res.status(404).json({message:"Doubt not found"})
        }
        if(doubt.askedBy.toString()!==req.user.id){
            return res.status(403).json({message:"Unauthorized"})
        }
        doubt.solved=true
        await doubt.save()
        res.status(200).json({message:"Doubt solved"})
    }
    catch(err){
        res.status(500).json({message:"Update failed"})
    }
})
//DELETE DOUBT
doubtApp.delete("/:id",verifyToken,async(req,res)=>{
    try{
        const doubt=await DoubtModel.findById(req.params.id)
        if(!doubt){
            return res.status(404).json({message:"Doubt not found"})
        }
        if(doubt.askedBy.toString()!==req.user.id){
            return res.status(403).json({message:"Unauthorized"})
        }
        await DoubtModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Doubt deleted"})
    }
    catch(err){
        res.status(500).json({message:"Delete failed"})
    }
})
