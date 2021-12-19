const express = require("express")
const app = express()
const server = require("http").Server(app)
const io = module.exports.io = require("socket.io")(server, {cors: {origin: '*'}})
require('dotenv').config()

const PORT = process.env.PORT || 5000;

const gameState = {
    players: {}
}

const physics = {
    groundPos: 660,
    playerSpeed: 0.8,
    jumpVelocity: 40,
    sideJumpVelocity: 0.4,
    gravity: 0.7
}

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

    // Chat Handler
    socket.on("join-room", ({ serverData, userData }) => {
        socket.join(serverData.id)
        getRoomSize();
        for (const player in gameState.players) {
            if (gameState.players[player].name != userData.name) {
                io.sockets.emit('game-display-player', gameState.players[player]);
            }
        }
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

    // Game Handler
    socket.on('game-add-player', (data) => {
        gameState.players[socket.id] = {...data};
        io.sockets.emit('game-display-player', data);
        console.log(`Player ID <${userID}> added a player.`)
    })

    socket.on('game-player-movement', (key) => {
        let player = gameState.players[socket.id];
        if (player == null) return;

        let up = key.ArrowUp || key.w || key[" "];
        let down = key.ArrowDown || key.s;
        let left = key.ArrowLeft || key.a;
        let right = key.ArrowRight || key.d;
        let width = key.canvasWidth;

        if (up && !player.isJumping) {
            player.dY -= physics.jumpVelocity;
            player.isJumping = true;
        }
        if (down) {
            player.dY += physics.jumpVelocity;
        }

        if (player.x + 20 < width) {
            if (player.isJumping && right) {
                player.dX += physics.sideJumpVelocity;
            }
            if (right) {
                player.dX += physics.playerSpeed;
                player.direction = 0;
            } 
        }

        if (player.x > 0) {
            if (player.isJumping && left) {
                player.dX -= physics.sideJumpVelocity;
            }
            if (left) {
                player.dX -= physics.playerSpeed;
                player.direction = 0;
            }
        }

        player.dY += physics.gravity;
        player.x += player.dX;
        player.y += player.dY;
        player.dX *= 0.9;
        player.dY *= 0.9;

        // Boundaries Left
        if (player.x + player.dX < 0) {
            player.x = 0;
        }

        if (player.x > width) {
            player.x = width - player.dX - 20;
        }

        if (player.y >= 660) {
            player.isJumping = false;
            player.y = 660;
        }
    })

    setInterval(() => {
        if (gameState == null) return;
        io.sockets.emit('game-state', gameState);
    }, 1000 / 60);

    socket.on("leave-server", () => {
        socket.disconnect();    
    })

    socket.on('disconnect', () => {
        getRoomSize();
        delete gameState.players[socket.id];
        console.log(`Player ID <${userID}> disconnected from the server.`)
    })
});

//app.use(router);

server.listen(PORT, () => {
    console.log("[-] ClubCryptic Server")
    console.log("[-] Running on port " + PORT)
})