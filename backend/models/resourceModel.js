import { Schema, model } from "mongoose";
const resourceSchema=new Schema({
    title:{
        type:String,
        required:[true,"Title required"],
        trim:true
    },
    description:{
        type:String,
        default:""
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
//SEARCH OPTIMIZATION
resourceSchema.index({
    title:"text",
    subject:"text",
    topic:"text"
});
export const ResourceModel=model("resource",resourceSchema)