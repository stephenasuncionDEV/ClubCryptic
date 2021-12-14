import React, { useState, useEffect, useRef, useMemo } from 'react'
import env from 'react-dotenv'
import { auth, logoutHandler, getUser } from '../firebase';
import logo from './assets/header-logo.png'
import DiscordIcon from './icons/DiscordIcon'
import { Redirect } from '../discordAuth'
import { useLocation } from "react-router-dom";
import Alert from './Alert';
import Game from './Game';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ServerSelection from './ServerSelection';
import io from 'socket.io-client'

const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const serverList = [
    {
        name: "Global", 
        id: "1337",
        currentPlayers: -1,
        maxPlayers: 10
    },
    {
        name: "Fortune", 
        id: "1338",
        currentPlayers: -1,
        maxPlayers: 10
    },
    {
        name: "Celebrity", 
        id: "1339",
        currentPlayers: -1,
        maxPlayers: 10
    }
]

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [userData, setUserData] = useState({});
    const [serverData, setServerData] = useState({});
    const [socket, setSocket] = useState();
    const [alertState, setAlertState] = useState({severity: "error", message: "Error Code: 1337", duration: 3000});
    const query = useQuery();
    const alertRef = useRef();
    const serverSelectRef = useRef();
    const ENDPOINT = "http://localhost:5000/";

    useEffect(() => {
        const getUserData = async () => {
            const data = await getUser(auth.currentUser.email);
            setUserData(data);
        }
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                getUserData();
            } else {
                setIsLoggedIn(false);
            }
        })
    }, [])

    useEffect(() => {
        if (isLoggedIn && Object.keys(userData).length !== 0) {
            const newSocket = io(ENDPOINT, {
                query: {
                    userID: userData.id
                }
            });
            setSocket(newSocket)
        }
    }, [isLoggedIn, userData, userData.id])

    useEffect(() => {
        if (query.has("code") && !isLoggedIn) {
            onLogin(query.get("code"));
            window.history.replaceState({}, document.title, "/");
            toggleAlert("info", "ClubCryptic v.0.0.1", 6000);
        }
    }, [query, isLoggedIn])

    useEffect(() => {
        if (query.has("serverID") && isLoggedIn) {
            const serverID = query.get("serverID");
            const serverIndex = serverList.findIndex(s => s.id === serverID)
            setServerData(serverList[serverIndex]);
            if (Object.keys(serverData).length === 0 || socket == null) return;
            if (serverList[serverIndex].name !== serverData.name && isConnected) {
                socket.emit("leave-room", { serverData, userData });
                return;
            };
            socket.emit("join-room", { serverData, userData });
            setIsConnected(true);
        }
    }, [query, isLoggedIn, socket, serverData, userData, isConnected])

    useEffect(() => {
        if (socket == null) return;
        socket.on("server-count", (data) => {
            for (let i = 0; i < serverList.length; i++) {
                if (serverList[i].name === Object.keys(data)[i]) {
                    serverList[i].currentPlayers = data[serverList[i].name];
                }         
            }
        });
        return () => socket.off("server-count")
    }, [socket])

    const onLogin = async (code) => {
        await Redirect(code);
    }

    const onAuthenticate = () => {
        window.location.assign(env.DISCORD_AUTH_URL);
    }

    const onJoinDiscord = () => {
        window.open(env.DISCORD_SERVER, '_blank');
    }

    const toggleAlert = (severity, message, duration) => {
        setAlertState({severity: severity, message: message, duration: duration});
        alertRef.current.handleOpen(); //error, warning, info, success
    }

    return (
        <div className="App">
            <Alert {...alertState} ref={alertRef}/>
            <div className="pane">
                <div className="center-pane">
                    <header className="header">
                        <img className="center-item" src={logo} alt="ClubCryptic Logo" />
                        <h1>CLUB CRYPTIC</h1>
                    </header>
                    {!isLoggedIn ? (
                        <button className='center-item button-style-icon button-style-blue' onClick={onAuthenticate}>
                            <DiscordIcon />
                            <span>Login with Discord</span>
                        </button>
                    ) : (
                        <>
                            <p className="welcome-message">Hello {auth.currentUser.displayName} 👋</p>
                            <div className='space-even-container'>
                                    <button className='button-style-icon button-style-other' id="play-button" onClick={() => serverSelectRef.current.handleOpen()}>
                                        <CelebrationIcon />
                                        <span>Play</span>
                                    </button>
                                <button className='button-style-icon button-style-blue' onClick={onJoinDiscord}>
                                    <DiscordIcon />
                                    <span>Join Our Discord</span>
                                </button>
                                <button className='button-style-no' onClick={logoutHandler}>Logout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isLoggedIn && (
                <>
                    <ServerSelection
                        toggleAlert={toggleAlert}
                        socket={socket}
                        serverList={serverList}
                        ref={serverSelectRef}
                    />
                    {isConnected && 
                    <Game 
                        toggleAlert={toggleAlert}
                        socket={socket}
                        userData={userData}
                        serverData={serverData}
                    /> 
                    }
                </>
            )}
        </div>
    );
}

export default App;