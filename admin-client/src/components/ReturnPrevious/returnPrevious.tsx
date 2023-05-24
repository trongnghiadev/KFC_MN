import React from 'react';
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {HiArrowLeft} from "react-icons/hi";

const ReturnPrevious = () => {
    const navigate = useNavigate();
    return (
        <header className={"mb-2.5"}>
                <Button variant={"text"} onClick={() => navigate(-1)}><HiArrowLeft/> Back</Button>
            </header>
    );
};

export default ReturnPrevious;