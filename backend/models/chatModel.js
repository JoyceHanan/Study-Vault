import {Schema,model} from "mongoose";
const chatSchema = new Schema({
    roomId:{
        type:String,
        required:[true,"Room ID required"]
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    message:{
        type:String,
        required:[true,"Message required"]
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const ChatModel=model("chat",chatSchema)