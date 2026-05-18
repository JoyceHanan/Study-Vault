import { Schema, model } from "mongoose";
const resourceSchema=new Schema({
    title:{
        type:String,
        required:[true,"Title required"]
    },
    description:{
        type:String
    },
    subject:{
        type:String,
        required:[true,"Subject required"]
    },
    unit:{
        type:String
    },
    topic:{
        type:String
    },
    semester:{
        type:Number
    },
    fileUrl:{
        type:String,
        required:[true,"File required"]
    },
    fileType:{
        type:String
    },
    uploadedBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    tags:[
        String
    ],
    upvotes:[
        {
            type:Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    downvotes:[
        {
            type:Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    downloads:{
        type:Number,
        default:0
    }

},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const ResourceModel=model("resource",resourceSchema)