import {Schema,model} from "mongoose";
const reportSchema=new Schema({
    reportedBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    resourceId:{
        type:Schema.Types.ObjectId,
        ref:"resource"
    },
    doubtId:{
        type:Schema.Types.ObjectId,
        ref:"doubt"
    },
    reason:{
        type:String,
        required:[true,"Reason required"]
    },
    status:{
        type:String,
        enum:["pending","resolved"],
        default:"pending"
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
export const ReportModel=model("report",reportSchema)