import exp from "express"
import {ResourceModel} from "../models/resourceModel.js"
import {UserModel} from "../models/userModel.js"
import {verifyToken} from "../middleware/verifyToken.js"
export const resourceApp=exp.Router()
//UPLOAD RESOURCE
resourceApp.post("/upload",verifyToken,async(req,res)=>{
    try{
        const newResource=req.body
        newResource.uploadedBy=req.user.id
        const resourceDoc=new ResourceModel(newResource)
        await resourceDoc.save()
        res.status(201).json({message:"Resource uploaded successfully",payload:resourceDoc})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Upload failed",error:err.message})
    }
})
//GET ALL RESOURCES
resourceApp.get("/",async(req,res)=>{
    try{
        const resources=await ResourceModel.find().populate("uploadedBy","name email")
        res.status(200).json({message:"Resources fetched",payload:resources})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Cannot fetch resources"})
    }
})
//GET RESOURCE BY ID
resourceApp.get("/:id",async(req,res)=>{
    try{
        const resource=await ResourceModel.findById(req.params.id).populate("uploadedBy","name email")
        if(!resource){
            return res.status(404).json({message:"Resource not found"})
        }
        res.status(200).json({payload:resource})
    }
    catch(err){
        res.status(500).json({message:"Error fetching resource"})
    }
})
//UPDATE RESOURCE
resourceApp.put("/:id",verifyToken,async(req,res)=>{
    try{
        const resource=await ResourceModel.findById(req.params.id)
        if(!resource){
            return res.status(404).json({message:"Resource not found"})
        }
        if(resource.uploadedBy.toString()!==req.user.id){
            return res.status(403).json({message:"Unauthorized"})
        }
        const updatedResource=
        await ResourceModel.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).json({message:"Resource updated",payload:updatedResource})
    }
    catch(err){
        res.status(500).json({message:"Update failed"})
    }
})
//DELETE RESOURCE
resourceApp.delete("/:id",verifyToken,async(req,res)=>{
    try{
        const resource=await ResourceModel.findById(req.params.id)
        if(!resource){
            return res.status(404).json({message:"Resource not found"})
        }
        if(resource.uploadedBy.toString()!==req.user.id){
            return res.status(403).json({message:"Unauthorized"})

        }
        await ResourceModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"Resource deleted"})
    }
    catch(err){
        res.status(500).json({message:"Delete failed"})
    }
})
//UPVOTE
resourceApp.post("/:id/upvote",verifyToken,async(req,res)=>{
    try{
        const userId=req.user.id
        const resource=await ResourceModel.findById(req.params.id)
        if(!resource){
            return res.status(404).json({message:"Resource not found"})
        }
        resource.downvotes=resource.downvotes.filter(id=>id.toString()!==userId)
        if(!resource.upvotes.includes(userId)){
            resource.upvotes.push(userId)
        }

        await resource.save()
        res.status(200).json({message:"Upvoted"})
    }
    catch(err){
        res.status(500).json({message:"Vote failed"})
    }
})
//DOWNVOTE
resourceApp.post("/:id/downvote",verifyToken,async(req,res)=>{
    try{
        const userId=req.user.id
        const resource=await ResourceModel.findById(req.params.id)
        if(!resource){
            return res.status(404).json({message:"Resource not found"})
        }
        resource.upvotes=resource.upvotes.filter(id=>id.toString()!==userId)
        if(!resource.downvotes.includes(userId)){
            resource.downvotes.push(userId)
        }
        await resource.save()
        res.status(200).json({message:"Downvoted"})
    }
    catch(err){
        res.status(500).json({message:"Vote failed"})
    }
})
//SEARCH RESOURCE
resourceApp.get("/search",async(req,res)=>{
    try{
        const keyword=req.query.q
        const resources=await ResourceModel.find({$or:[{title:{$regex:keyword,$options:"i"}},
                                            {subject:{$regex:keyword,$options:"i"}},
                                            {topic:{$regex:keyword,$options:"i"}}]})
        res.status(200).json({payload:resources})
    }
    catch(err){
        res.status(500).json({message:"Search failed"})
    }
})
//DOWNLOAD RESOURCE
resourceApp.get("/download/:id",verifyToken,async(req,res)=>{
    try{
        const resource=await ResourceModel.findById(req.params.id)
        if(!resource){
            return res.status(404).json({message:"Resource not found"})
        }
        resource.downloads+=await resource.save()
        await UserModel.findByIdAndUpdate(req.user.id,{$addToSet:{downloads:resource._id}})
        res.status(200).json({message:"Download started",fileUrl:resource.fileUrl})
    }
    catch(err){
        res.status(500).json({message:"Download failed"})
    }
})