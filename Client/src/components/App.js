import React, { useEffect, useState, useRef, useMemo } from 'react'
import env from 'react-dotenv'
import { auth, logoutHandler } from '../firebase';
import logo from './assets/header-logo.png'
import DiscordIcon from './icons/DiscordIcon'
import { Redirect } from '../discordAuth'
import { useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import SideChat from './SideChat';
import Alert from './Alert';

const useQuery = () => {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuState, setMenuState] = useState(false);
    const [toggleAlert, setToggleAlert] = useState({severity: "error", message: "Error Code: 1337", duration: 3000});
    const query = useQuery();
    const alertRef = useRef();

    const onLogin = async (code) => {
        await Redirect(code);
    }

    useEffect(() => {
        if (query.has("code") && isLoggedIn === false) {
            onLogin(query.get("code"));
            query.delete("code");
            window.history.replaceState({}, document.title, "/");
            showAlert("info", "ClubCryptic v.0.0.1", 6000);
        }
    }, [query, isLoggedIn])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        })
    }, [])

    const showAlert = (severity, message, duration) => {
        setToggleAlert({severity: severity, message: message, duration: duration});
        alertRef.current.handleOpen();
        //error, warning, info, success
    }

    const onAuthenticate = () => {
        window.location.assign(env.DISCORD_AUTH_URL);
    }

    const onJoinDiscord = () => {
        window.open(env.DISCORD_SERVER, '_blank');
    }

    const toggleMenu = () => {
        setMenuState(!menuState);
    }

    return (
        <div className="App">
            <Alert {...toggleAlert} ref={alertRef}/>
            {isLoggedIn && (
                <>
                    <SideChat toggleMenu={toggleMenu} menuState={menuState}/>
                    <MenuIcon id="menu-button" onClick={toggleMenu}/>
                </>
            )}
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
        </div>
    );
}

export default App;