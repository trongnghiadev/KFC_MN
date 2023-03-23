import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

export interface DialogPros {
    confirmHandler: any,
    closeHandler?: any,
    open: boolean,
    message?: string,
    title?: string
}

const CusConfirmDialog = (props: DialogPros) => {
    const {confirmHandler, closeHandler, open, message, title} = props
    return (
        <Dialog
            open={open}
            onClose={closeHandler}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title ? title : "Confirm ?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={confirmHandler}>Confirmed</Button>
                <Button onClick={closeHandler} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CusConfirmDialog;