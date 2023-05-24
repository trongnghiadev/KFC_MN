import React, {EventHandler} from 'react';
import {TbBuildingWarehouse} from "react-icons/tb";
import IWarehouse from "../../../../Interfaces/warehouse.interface";
import {Button, Chip, IconButton} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {BiEdit} from "react-icons/bi";

type listProps = {
    warehouses: Array<IWarehouse>,
    addHandler?: EventHandler<any>,
    updateHandler : Function,
    isModify: boolean
}

interface warehouseItemProps {
    warehouse: IWarehouse,
    isModify: boolean,
    updateHandler?: EventHandler<any>
}

const Warehouse = (props: warehouseItemProps)=>{
    const {name, address, state, id} = props.warehouse
    const {isModify, updateHandler} = props
    const navigate = useNavigate()
    const location = useLocation()
    let statusColor:"success" | "error" = state === "active" ? "success" : "error"

    return (
        <div
            onClick={!isModify && (()=>{navigate(location.pathname + "/" + id)}) || (()=>{})}
            className={"w-[300px] h-fit relative flex flex-col rounded overflow-hidden shadow-md cursor-pointer hover:scale-[1.02] transition-all"}>
            {isModify &&
                <div className={"absolute w-fit h-fit top-0.5 right-0.5 z-30"}>
                    <IconButton onClick={updateHandler}>
                        <BiEdit color={"#ff8800"}/>
                    </IconButton>
                </div>
            }
            <img src={"https://images.unsplash.com/photo-1487611459768-bd414656ea10?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"} alt={"Warehouse"}/>
            <div className={"p-6 relative"}>
                <h3>{name}</h3>
                <em className={"text-zinc-400"}>{address}</em>
                <Chip className={"absolute top-1 right-1 capitalize"} color={statusColor} label={state} />
            </div>
        </div>
    )
}

const WarehousesList = (props: listProps) => {
    const {warehouses, updateHandler, isModify} = props
    return (
        <div className={"w-full bg-white p-6 rounded drop-shadow-sm"}>
            <div className={"flex flex-row flex-wrap w-full gap-4 mt-6"}>
                {
                    warehouses.map((warehouse)=>(
                        <Warehouse isModify={isModify} updateHandler={()=>updateHandler(warehouse)} key={warehouse.id} warehouse={warehouse}/>
                    ))
                }
            </div>
        </div>
    );
};

export default WarehousesList;