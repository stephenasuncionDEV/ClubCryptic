import React, { useState, useEffect, useRef } from 'react'
import { Box, SwipeableDrawer, TextField, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { AutoSizer } from 'react-virtualized'; 
import CustomScrollbar from './CustomScrollbar'
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DnsIcon from '@mui/icons-material/Dns';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import VerifiedIcon from '@mui/icons-material/Verified';

const renderRow = (props) => {
    const { data, index, style } = props;
    const item = data[index];

    return (
        <ListItem style={style} button key={index} component="div" disablePadding>
            <ListItemIcon>
                {item.icon === 0 && <DnsIcon />}
                {item.icon === 1 && <PersonIcon />}
                {item.icon === 2 && <HowToRegIcon />}
                {item.icon === 3 && <VerifiedIcon />}
            </ListItemIcon>
            <ListItemText 
                primary={<Typography style={{ color: item.nameColor }}>{item.author} {item.isAdmin && ("👑")}</Typography>}
                secondary={item.message} />
        </ListItem>
    )
}

const SideChat = ({toggleMenu, menuState, userData, socket, serverData}) => {
    const [messageValue, setMessageValue] = useState("");
    const [messages, setMessages] = useState([]);
    const outerListRef = useRef();

    const onItemsRendered = () => {
        outerListRef.current.scrollTop = outerListRef.current.scrollHeight;
    }

    useEffect(() => {
        if (socket == null) return;

        socket.on("receive-message", (data) => {
            const messageData = {
                serverID: data.serverID,
                author: data.author,
                nameColor: data.nameColor,
                icon: data.icon,
                message: data.message,
                isAdmin: data.isAdmin
            }
            setMessages([...messages, messageData]);
        });

        return () => socket.off("receive-message")
    }, [socket, messages])

    const onSend = () => {
        const messageData = {
            serverID: serverData.id,
            author: userData.nickname,
            nameColor: (userData.isAdmin ? "#0000FF" : "#000000"),
            icon: (userData.isAdmin ? 2 : 1),
            message: messageValue,
            isAdmin: userData.isAdmin
        }
        socket.emit("send-message", { messageData });
        setMessages([...messages, messageData]);
        setMessageValue("");
    }

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
                    <span>Server: {serverData.name}</span>
                    <h1>Chat</h1>
                </div>
                <div id="menu-chat-container">
                    <div id="menu-top">
                        <AutoSizer>
                            {({ height, width }) => { 
                                return (
                                    <FixedSizeList
                                        id="menu-chat-list"
                                        outerRef={outerListRef}
                                        outerElementType={CustomScrollbar}
                                        height={height}
                                        width={324}
                                        itemSize={72}
                                        itemCount={messages.length}
                                        itemData={messages}
                                        onItemsRendered={onItemsRendered}
                                    >
                                        {renderRow}
                                    </FixedSizeList>
                                )
                            }}
                        </AutoSizer>
                    </div>
                    <div id="menu-bottom">
                        <TextField 
                            id="menu-chat"
                            label="message"
                            fullWidth
                            variant="standard"
                            value={messageValue}
                            onChange={(e) => setMessageValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onSend();
                                }
                            }}
                        />
                        <button className='button-style-icon button-style-other button-full-width margin-top' onClick={onSend}>
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