import {Schema, model} from "mongoose";
const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name required"],
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Email required"],
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"Password required"]
    },
    photo:{
        type:String,
        default:""
    },
    college:{
        type:String
    },
    branch:{
        type:String
    },
    semester:{
        type:Number
    },
    googleAuth:{
        type:Boolean,
        default:false
    },
    refreshToken:{
        type:String
    },
    points:{
        type:Number,
        default:0
    },
    badges:[
        {
            type:String
        }
    ],
    savedResources:[
        {
            type:Schema.Types.ObjectId,
            ref:"resource"
        }
    ],
    downloads:[
        {
            type:Schema.Types.ObjectId,
            ref:"resource"
        }
    ]
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})
export const UserModel=model("user",userSchema)