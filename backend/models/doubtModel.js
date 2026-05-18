import {Schema,model} from "mongoose";
const doubtSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    subject:{
        type:String
    },
    topic:{
        type:String
    },
    askedBy:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    solved:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
export const DoubtModel=model("doubt",doubtSchema)