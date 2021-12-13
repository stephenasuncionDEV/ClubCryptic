import React, { useState, useCallback, forwardRef, useRef } from 'react'
import { Box, SwipeableDrawer, TextField, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { AutoSizer } from 'react-virtualized'; 
import { Scrollbars } from "react-custom-scrollbars";
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DnsIcon from '@mui/icons-material/Dns';

const renderRow = (props) => {
    const { data, index, style } = props;
    const item = data[index];

    return (
        <ListItem style={style} button key={index} component="div" disablePadding>
            <ListItemIcon>
                {item.icon}
            </ListItemIcon>
            <ListItemText 
                primary={<Typography style={{ color: item.nameColor }}>{"@" + item.author}</Typography>}
                secondary={item.message} />
        </ListItem>
    )
}

const SideChat = ({toggleMenu, menuState}) => {
    const outerListRef = useRef();

    const [messages, setMessages] = useState([
        {
            author: "System",
            nameColor: "#3458eb",
            icon: <DnsIcon />,
            message: "Welcome to Club Cryptic!!!"
        },
    ])

    const CustomScrollbars = ({ onScroll, forwardedRef, style, children }) => {
        const refSetter = useCallback(scrollbarsRef => {
            if (scrollbarsRef) {
                forwardedRef(scrollbarsRef.view);          
            } 
            else {
                forwardedRef(null);
            }
        }, [forwardedRef]);
      
        return (
            <Scrollbars
                ref={refSetter}
                style={{ ...style, overflow: "hidden" }}
                onScroll={onScroll}
            >
                {children}
            </Scrollbars>
        );
    };

    const CustomScrollbarsVirtualList = forwardRef((props, ref) => {
        return (
            <CustomScrollbars {...props} forwardedRef={ref}/>
        )
    });

    const onItemsRendered = () => {
        outerListRef.current.scrollTop = outerListRef.current.scrollHeight;
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
                                        outerElementType={CustomScrollbarsVirtualList}
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