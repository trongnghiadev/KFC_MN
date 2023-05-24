import React, {useEffect, useState} from 'react';
import {Link, Route, Routes, useParams} from "react-router-dom";
import Facility from "./Facility/facility";
import Storage from "./Storage/storage"
import In_outbound from "./InventoryAdjustments/inventoryAdjustments";

import WarehousesList from "./Warehouse/list";
import axios from "axios";
import env from "../../../env";

import EmptyBox from "../../../assets/empty-box.svg"
import {Button} from "@mui/material";
import WarehouseEdit from "./Warehouse/warehouseEdit";
import useFetch, {fetchProps} from "../../../Hooks/useFetch";
import {set} from "react-hook-form";
import LoadingCover from "../../../components/LoadingCover/loadingCover";
import IWarehouse, {warehouseInit} from "../../../Interfaces/warehouse.interface";
import WarehouseDetail from "./Warehouse/warehouseDetail";
import NoDataFound from "../../../components/NoDataFound/noDataFound";
import {TbBuildingWarehouse} from "react-icons/tb";



const InventoryRoutes = () => {
    return(<>
        <Routes>
            <Route path={"/"} element={<DefaultRoute />}></Route>
                <Route path={"/:whId"} element={<WarehouseDetail />}></Route>
                <Route path={"/:whId/facility"} element={<Facility/>}></Route>
                <Route path={"/:whId/storage"} element={<Storage/>}></Route>
                <Route path={"/:whId/inventory-adjustments"} element={<In_outbound/>}></Route>
        </Routes>
    </>)
}

const DefaultRoute = () =>{

    const [warehouses, setWarehouses] = useState<Array<IWarehouse>>([]);

    const [fetchOpt, setFetOpt] = useState<fetchProps>({path: "/warehouse/", method: "get", reFetch: false})

    const {data, isLoading, isError} = useFetch(fetchOpt)
    const [modalControl, updateModalControl] = useState({
        isAdd: false, isUpdate: false
    })

    const rerender = () => setFetOpt((prev)=>({...prev, reFetch: !prev.reFetch}))

    useEffect(()=>{
        //@ts-ignore
        if(data != null) setWarehouses(data.warehouse);
    }, [data])

    const [selectedWarehouse, setSelected] = useState(warehouseInit)

    const closeForm = () =>{
        updateModalControl({isUpdate: false, isAdd: false})
        setSelected(warehouseInit)
    }

    const setupAddForm = ()=>{
        setSelected(warehouseInit)
        updateModalControl({
            isAdd: true,
            isUpdate: false
        })
    }

    const updateForm = (selectedItem:IWarehouse) => {
        setSelected(selectedItem)
        updateModalControl({
            isAdd: false,
            isUpdate: true
        })
    }

    const [isModify, requestModify] = useState(false)

    return (
        <>
            {/*Providers*/}
            <LoadingCover visible={isLoading}/>
            {
                (modalControl.isAdd || modalControl.isUpdate) &&
                <WarehouseEdit openForm={modalControl.isAdd || modalControl.isUpdate} closeHandler={closeForm} isUpdate={modalControl.isUpdate} item={selectedWarehouse} reRender={rerender}/>
            }
            {!isLoading &&
            <main className={"pt-4 w-full"}>
                <h1>Inventory manager</h1>
                <div className={"title flex flex-col md:flex-row gap-2 justify-end"}>
                    <Button onClick={setupAddForm} disabled={isModify}>+ Add</Button>
                    <Button onClick={()=>requestModify((prev)=>!prev)}>{isModify ? "Cancel" : "Modify"}</Button>
                </div>
                <hr className={"mb-4"}/>
                {
                    warehouses.length == 0 && <NoDataFound title={"No warehouse was setup"} addHandler={setupAddForm}/>
                }
                {
                    warehouses.length > 0 &&
                    <WarehousesList isModify={isModify} updateHandler={updateForm} addHandler={()=>updateModalControl({isUpdate: false, isAdd:true})} warehouses={warehouses}/>
                }

            </main>
            }
        </>)
}

const Inventory = () => {

    return (
        <>
            {/*TODO: Làm tiếp đoạn mở giao diện edit kho lên (Giao diện quản lý thông tin chung của khi)*/}
            {/*<WarehouseEdit />*/}

            <InventoryRoutes/>
            {/*Main*/}

        </>
    );
};

export default Inventory;