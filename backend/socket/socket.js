export const socketConnection=(io)=>{
    io.on("connection",(socket)=>{
        console.log("User connected:",socket.id);
        // Join room
        socket.on("join-room",(roomId)=>{
            socket.join(roomId);
            console.log(`User ${socket.id} joined ${roomId}`);
        });
        // Chat messages
        socket.on("send-message",(data)=>{
            io.to(data.roomId).emit("receive-message",
                {
                    sender:data.sender,
                    message:data.message
                }
            );
        });
        // Whiteboard drawing
        socket.on("drawing",(data)=>{
            socket.to(data.roomId).emit("receive-drawing",data);
        });
        // Clear board
        socket.on("clear-board",(roomId)=>{
            io.to(roomId).emit("board-cleared");
        });
        // Disconnect
        socket.on("disconnect",()=>{
            console.log("User disconnected:",socket.id);
        });
    });
};