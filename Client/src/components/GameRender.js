import React, { useEffect, useRef } from "react";
import { renderPlayers, addPlayer, updatePlayer } from "./renders/PlayerRender"

const playerMovement = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
    f: false,
    " ": false,
    canvasWidth: 1920
};

const GameRender = ({toggleAlert, socket, serverData, userData, menuState}) => {
    const canvasRef = useRef();
    const ctxRef = useRef();

    useEffect(() => {
        if (socket == null) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctxRef.current = ctx;
        playerMovement.canvasWidth = canvas.width;
        socket.emit('game-add-player', {
            name: userData.nickname,
            x: canvas.width / 2,
            y: canvas.height / 2,
            dX: 10,
            dY: 10,
            isJumping: false,
            direction: 0,
        });
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderPlayers(ctx);
            requestAnimationFrame(render);
        }
        render();
    }, [socket, userData])

    useEffect(() => {
        if (socket == null) return;
        socket.on('game-display-player', (data) => {
            addPlayer(data);
        })
        return () => socket.off("game-display-player")
    }, [socket])

    useEffect(() => {
        if (socket == null) return;
        socket.on('game-state', (gameState) => {
            for (const player in gameState.players) {
                updatePlayer(gameState.players[player])
            }
        })
        return () => socket.off("game-state")
    }, [socket])

    const myKeys = (key, bool) => {
        const keyArr = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d", "f", " "];
        for (let k = 0; k < keyArr.length; k++) {
            if (key === keyArr[k]) {
                playerMovement[keyArr[k]] = bool;
            }
        }
    }

    window.onkeyup = (e) => {
        myKeys(e.key, false);
    }

    window.onkeydown = (e) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
        }
        myKeys(e.key, true);
    }

    setInterval(() => {
        if (menuState == null) return;
        if (menuState === false) {
            socket.emit('game-player-movement', playerMovement);
        }
    }, 1000 / 60);

    return (
        <>
            <canvas 
                id="game-display"
                ref={canvasRef}
                height={window.innerHeight}
                width={window.innerWidth}
            />
        </>
    )
}

export default GameRender;