import React, { useEffect, useState } from 'react'
import env from 'react-dotenv'
import { auth, logoutHandler } from '../firebase';
import logo from './assets/header-logo.png'
import DiscordIcon from './icons/DiscordIcon'
import { Redirect } from '../discordAuth'
import { useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import SideChat from './SideChat';

const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuState, setMenuState] = useState(false);
    const query = useQuery();

    const onLogin = async (code) => {
        await Redirect(code);
    }

    useEffect(() => {
        const code = query.get("code");
        if (code != null) {
            onLogin(code);
        }
    }, [query])

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        })
    }, [])

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