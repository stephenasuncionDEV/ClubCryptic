const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = module.exports.io = require("socket.io")(server, {cors: {origin: '*'}})
require('dotenv').config()

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
    const userID = socket.handshake.query.userID;
    console.log(`Player ID <${userID}> connected to server.`)

    const serverCount = {
        Global: -1,
        Fortune: -1,
        Celebrity: -1
    }

    const getRoomSize = async () => {
        const Global = await io.in("1337").fetchSockets();
        const Fortune = await io.in("1338").fetchSockets();
        const Celebrity = await io.in("1339").fetchSockets();
        serverCount["Global"] = Global.length;
        serverCount["Fortune"] = Fortune.length;
        serverCount["Celebrity"] = Celebrity.length;
        io.sockets.emit("server-count", serverCount);
    }

    getRoomSize();

    // Chat Servers
    socket.on("join-room", ({ serverData, userData }) => {
        socket.join(serverData.id)
        getRoomSize();
        console.log(`Player ID <${userData.id}> joined server <${serverData.name}>.`)
    })

    socket.on("leave-room", ({ serverData, userData }) => {
        socket.leave(serverData.id)
        getRoomSize();
        console.log(`Player ID <${userData.id}> left server <${serverData.name}>.`)
    })

    socket.on("send-message", ({ messageData }) => {
        socket.to(messageData.serverID).emit("receive-message", messageData);
    })

    socket.on("leave-server", () => {
        socket.disconnect();    
    })

    socket.on('disconnect', () => {
        getRoomSize();
        console.log(`Player ID <${userID}> disconnected from the server.`)
    })
});

//app.use(router);

server.listen(PORT, () => {
    console.log("[-] ClubCryptic Server")
    console.log("[-] Running on port " + PORT)
})