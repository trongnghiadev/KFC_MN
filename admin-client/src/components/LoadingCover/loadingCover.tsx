import React from 'react';
import {Fade} from "@mui/material";
import loadingCover from "./loadingImg.svg"

type loadingProps = {
    visible: boolean
}

const LoadingCover = (props: loadingProps) => {
    const {visible} = props
    return (
        <Fade in={visible}>
            <div className={"top-0 left-0 absolute flex justify-center items-center w-full h-screen z-[1400] bg-black/25 "}>
                <img src={loadingCover} alt={"Loading"}/>
            </div>
        </Fade>
    );
};

export default LoadingCover;