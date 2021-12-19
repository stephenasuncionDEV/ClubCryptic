import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import SideChat from './SideChat';
import GameRender from './GameRender'

const Game = ({toggleAlert, socket, serverData, userData}) => {
    const [menuState, setMenuState] = useState(false);

    const toggleMenu = () => {
        setMenuState(!menuState);
    }
 
    return (
        <>
            <SideChat 
                toggleMenu={toggleMenu} 
                menuState={menuState} 
                socket={socket}
                serverData={serverData}
                userData={userData}
            />
            <MenuIcon id="menu-button" onClick={toggleMenu}/>
            <div id="game">
                <GameRender 
                    toggleAlert={toggleAlert}
                    menuState={menuState}
                    socket={socket}
                    serverData={serverData}
                    userData={userData}
                />
            </div>
        </>
    )
}

export default Game;