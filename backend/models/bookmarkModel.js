import {Schema,model} from "mongoose";
const bookmarkSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    resourceId:{
        type:Schema.Types.ObjectId,
        ref:"resource",
        required:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
export const BookmarkModel=model("bookmark",bookmarkSchema)