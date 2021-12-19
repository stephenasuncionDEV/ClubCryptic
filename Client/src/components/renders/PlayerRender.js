let players = []
let spritePos = 0;
let fps = 15;

const addPlayer = (data) => {
    class Player {
        constructor(name, x, y, dX, dY, isJumping, direction) {
            this.name = name;
            this.x = x;
            this.y = y;
            this.dX = dX;
            this.dY = dY;
            this.isJumping = isJumping;
            this.direction = direction;
        }
    
        draw(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgba(204, 84, 255, 0.5)";
            ctx.fill();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(134, 0, 191, 0.5)";
            ctx.stroke();
            ctx.restore();

            ctx.save();
            ctx.font = "12px Consolas";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(this.name, this.x, this.y);
            ctx.restore();
        }
    }

    const newPlayer = new Player(data.name, data.x, data.y, data.dX, data.dY, data.isJumping, data.direction);
    players.push(newPlayer);
}

const updatePlayer = (playerData) => {
    const d = playerData;
    for (let i = 0; i < players.length; i++) {
        let p = players[i];
        if (p.name === d.name) {
            players[i].x = playerData.x;
            players[i].y = playerData.y;
            players[i].dX = playerData.dX;
            players[i].dY = playerData.dY;
            players[i].isJumping = playerData.isJumping;
            players[i].direction = playerData.direction;
        }
    }
}

const renderPlayers = (ctx) => {
    players.forEach((player) => {
        player.draw(ctx);
    })
}

// setInterval(() => {
//     spritePos += 430;
// }, 1000 / fps)

export { addPlayer, renderPlayers, updatePlayer }