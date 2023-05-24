import React, {EventHandler} from 'react';
import EmptyBox from "./empty-box.svg";
import {Button} from "@mui/material";

type titleProps = {
    title?: string,
    addHandler?: EventHandler<any>
}

const NoDataFound = (props: titleProps) => {
    let {title, addHandler} = props
    title = title || "No data found";
    return (
        <div className={"bg-white p-6 text-center w-full h-fit flex flex-col items-center"}>
            <h2 className={"mb-4"}>{title}</h2>
            <img src={EmptyBox} alt={"No data was found"} width={150} height={150}/>
            {addHandler && <Button onClick={addHandler}>+ Click here to add</Button>}
        </div>
    );
};

export default NoDataFound;