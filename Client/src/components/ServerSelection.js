import React, { useState, forwardRef, useImperativeHandle } from "react";
import { List, ListItem, ListItemIcon, ListItemText, DialogTitle, Dialog } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import StorageIcon from '@mui/icons-material/Storage';
import LockIcon from '@mui/icons-material/Lock';

const SimpleDialog = (props) => {
    const {onClose, selectedValue, open, toggleAlert, serverList} = props;

    const handleClose = () => {
        onClose(selectedValue);
    };
  
    const handleListItemClick = (value) => {
        onClose(value);
        toggleAlert("success", `Connected to Server: ${value.name}, ID: ${value.id}`);
    };

    const getServerId = () => {
        const uuid = uuidv4();
        return 1337;
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Server List</DialogTitle>
            <List sx={{ pt: 0 }} className="list-style">
                {serverList.map((server) => (
                    <Link
                        to={`/?serverID=${server.id}`}
                        key={server.id}
                    >
                        <ListItem button onClick={() => handleListItemClick(server)}>
                            <ListItemIcon>
                                <StorageIcon />
                            </ListItemIcon>
                            <ListItemText primary={server.name} secondary={`Players: ${server.currentPlayers}/${server.maxPlayers}`}/>
                        </ListItem>
                    </Link>
                ))}

                <Link
                    to={`/?serverID=${getServerId()}`}
                >
                    <ListItem autoFocus button onClick={() => handleListItemClick('createPrivateServer')}>
                        <ListItemIcon>
                            <LockIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create a Private Server" secondary="Coming Soon ✌️" />
                    </ListItem>
                </Link>
            </List>
        </Dialog>
    )
}

const ServerSelection = (props, ref) => {
    const {toggleAlert, serverList} = props;
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(serverList[0]);

    useImperativeHandle(ref, () => ({
        handleOpen() {
            setOpen(true);
        }
    }), [])
    
    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <SimpleDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
            toggleAlert={toggleAlert}
            serverList={serverList}
        />
    )
}

export default forwardRef(ServerSelection);