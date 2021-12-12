import React, { useState } from 'react'
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DnsIcon from '@mui/icons-material/Dns';

const SideChat = ({toggleMenu, menuState}) => {
    const [messages, setMessages] = useState([{
        author: "System",
        icon: <DnsIcon />,
        message: "Welcome to Club Cryptic!!!"
    }])

    return (
        <SwipeableDrawer
            anchor="right"
            open={menuState}
            onClose={toggleMenu}
            onOpen={toggleMenu}
        >
            <Box
                id="menu-sidebar"
                role="presentation"
                noValidate
                autoComplete="off"
            >
                <div id="menu-header">
                    <CloseIcon id="menu-close-button" onClick={toggleMenu}/>
                </div>
                <div id="menu-chat-container">
                    <List>
                        {messages.map((data, index) => (
                            <ListItem button key={index}>
                                <ListItemIcon>
                                    {data.icon}
                                </ListItemIcon>
                                <ListItemText primary={"@" + data.author} secondary={data.message} />
                            </ListItem>
                        ))}
                    </List>
                    <div id="menu-bottom">
                        <TextField 
                            id="menu-chat"
                            label="message"
                            fullWidth
                            variant="standard"
                        />
                        <button className='button-style-icon button-style-other button-full-width margin-top'>
                            <SendIcon id="menu-send-icon"/>
                            <span>Send</span>
                        </button>
                    </div>
                </div>
            </Box>
        </SwipeableDrawer>
    )
}

export default SideChat;