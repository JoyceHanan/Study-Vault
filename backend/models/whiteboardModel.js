import {Schema,model} from "mongoose";
const whiteboardSchema=new Schema({
    roomName:{
        type:String,
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    participants:[
        {
            type:Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    boardData:{
        type:Array
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
export const WhiteboardModel=model("whiteboard",whiteboardSchema)