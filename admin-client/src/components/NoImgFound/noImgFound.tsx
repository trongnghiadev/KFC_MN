import React from 'react';
import noImgFound from '../../assets/no_img_found.png'
const NoImgFound = () => {
    return (
        <div className={"w-full h-fit"}>
            <img src={noImgFound} alt="No image have found" />
        </div>
    );
};

export default NoImgFound;