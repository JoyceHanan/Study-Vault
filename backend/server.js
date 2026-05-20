import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import cookieParser from "cookie-parser"
import cors from 'cors'
import {resourceApp} from './API/resourceAPI.js'
import {userApp} from './API/userAPI.js'
import {doubtApp} from './API/doubtAPI.js'
import {chatApp} from './API/chatAPI.js'
import {bookmarkApp} from './API/bookmarkAPI.js'
import {notificationApp} from './API/notificationAPI.js'
import {use} from 'react'
import {whiteboardApp} from './API/whiteboardAPI.js'
import {reportApp} from './API/reportAPI.js'
import http from "http";
import {Server} from "socket.io";
import {socketConnection}from "./socket/socket.js"
config()
 const app=exp()
 app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
//Socket connection
 const server=http.createServer(app);
 const io=new Server(server,{cors:{
        origin: "http://localhost:5173",
        credentials: true
    }});
 socketConnection(io);

 app.use(exp.json())
 app.use(cookieParser())
 app.use("/user-api",userApp)
 app.use("/resource-api",resourceApp)
 app.use("/doubt-api",doubtApp)
 app.use("/chat-api",chatApp)
 app.use("/bookmark-api",bookmarkApp)
 app.use("/notification-api",notificationApp)
 app.use("whiteboard-api",whiteboardApp)
 app.use("report-api",reportApp)
 const port=process.env.PORT||6000
 const connectionDb=async()=>{
    try{
        await connect(process.env.DB_URL);
        console.log("connected ");
        app.listen(port,()=>console.log(`server is started on ${port}`))
    }catch(err){
        console.log(err)
    }
 }
 connectionDb()
 app.use((req,res,next)=>{
    console.log(req.url);
    res.status(404).json({message:"invald path"})
})
//error handling
app.use((err,req,res,next)=>{
    //res.json({message:"error has occured",error:err.message}) this is very basic 
    console.log(err.name)
    console.log(err.message)
    //validation error
    if(err.name==='ValidationError'){
        return res.status(400).json({messsage:"the validations is failed "})
    }
     //casterror
      if(err.name==='CastError'){
        return res.status(400).json({messsage:"the validations is failed "})
    }
    //send server side errors
    res.status(500).json({message:"this is from server side"})
})
