import React, { useState, forwardRef, useImperativeHandle } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AlertDisplay = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Alert = (props, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        handleOpen() {
            setOpen(true);
        }
    }), [])


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={props.duration} onClose={handleClose}>
            <AlertDisplay onClose={handleClose} severity={props.severity.toLowerCase()} sx={{ width: '100%' }}>
                {props.message}
            </AlertDisplay>
        </Snackbar>   
    )
}

export default forwardRef(Alert);