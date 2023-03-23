import React from 'react';
import {HiLockClosed, HiPencil, HiPlus, HiTrash} from "react-icons/hi";
import {Button} from "@mui/material";

interface ToolBarProps {
    fnEdit?: Function,
    fnAdd?: Function,
    fnLock?: Function,
    fnDel?: Function,
    isSelecting: boolean
}

const CusDataGridToolBar = (props: ToolBarProps) => {
    const {fnEdit, fnLock, fnDel, fnAdd, isSelecting} = props
    return (
        <div className={"flex gap-4 my-4"}>
            {fnAdd && <Button variant={"contained"} onClick={() => fnAdd && fnAdd()}>
                <HiPlus></HiPlus>
            </Button>}
            {fnEdit && <Button variant={"contained"} onClick={() => fnEdit && fnEdit()} disabled={!isSelecting}>
                <HiPencil></HiPencil>
            </Button>}
            {fnLock && <Button color={"warning"} variant={"contained"} onClick={() => fnLock && fnLock()} disabled={!isSelecting}>
                <HiLockClosed></HiLockClosed>
            </Button>}
            {fnDel && <Button color={"error"} variant={"contained"} onClick={() => fnDel && fnDel()} disabled={!isSelecting}>
                <HiTrash></HiTrash>
            </Button>}
            <span className={"ml-auto"}>Ctrl + Click to unselect</span>
        </div>
    );
};

export default CusDataGridToolBar;