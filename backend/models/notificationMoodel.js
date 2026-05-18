import { Schema, model } from "mongoose";
const notificationSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    message:{
        type:String
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const NotificationModel=model("notification",notificationSchema)