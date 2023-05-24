import React, {EventHandler, useEffect, useState} from 'react';
import ReturnPrevious from "../../../../components/ReturnPrevious/returnPrevious";
import {RxPinBottom, RxPinTop, RxSymbol} from "react-icons/rx";
import {DataGrid, GridToolbarFilterButton, GridSelectionModel} from "@mui/x-data-grid";
import IInventoryLog, {inventoryLogInit} from "../../../../Interfaces/inventoryLogs.interface";
import useFetch, {fetchProps} from "../../../../Hooks/useFetch";
import {useParams} from "react-router-dom";
import NoDataFound from "../../../../components/NoDataFound/noDataFound";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";
import {Menu, MenuItem} from "@mui/material";
import InventoryAdjustmentEdit from "./inventoryAdjustmentEdit";
import CusDataGridToolBar from "../../../../components/CusDataGridToolBar/cusDataGridToolBar";
import CusConfirmDialog from "../../../../components/CusConfirmDialog/cusConfirmDialog";

const InOutbound = () => {
    const params = useParams();
    const [inventoryLogs, setIL] = useState<Array<IInventoryLog>>([])
    const [fetchOptions, setFetch] = useState<fetchProps>({
        method: "get",
        path: "/inventory",
        query: {warehouse: params.whId},
        fetchFor: "Get all inventory logs",
        reFetch: true
    })
    const {data, isLoading, fetchFor} = useFetch(fetchOptions)

    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([])

    useEffect(()=>{
        if (data != null){
            switch (fetchFor){
                case "Get all inventory logs":
                    // @ts-ignore
                    setIL(data.inventoryLogs)
                    break;
            }
        }
    }, [data])


    const ilColumns = [{
        field: "id", headerName: "ID", width: 100
    }, {
        field: "type", headerName: "Type", width: 100
    }, {
        field: "from", headerName: "From", width: 200
    }, {
        field: "to", headerName: "To", width: 200
    }, {
        field: "state", headerName: "State", width: 100
    }, {
        field: "delivered_at", headerName: "Delivered at", width: 250
    }, {
        field: "received_at", headerName: "Received at", width: 250
    }]

    const ilRows= inventoryLogs.map((row)=>
        ({...row, delivered_at: row.deliveredAt, received_at: row.receivedAt}))

    // Menu setup
    const [anchorEl, setAnchor] = useState <HTMLElement | null>(null);
    const handlerCloseMenu = () => setAnchor(null)

    const [serviceSelected, selectService] = useState<"inbound" | "outbound" | "transfer" | null>(null)

    const menuHandler = () => {
        updateModalControl({isAdd: true, isUpdate: false, isDel: false})
        handlerCloseMenu()
    }

    const [modalControl, updateModalControl] = useState({isAdd: false, isUpdate: false, isDel: false})

    const rerender = ()=>{
        setFetch((prev)=>({method: "get", path: "/", reFetch: prev.reFetch, isNotify: false}))
    }
    const closeModalHandler = ()=>{
        updateModalControl({isAdd: false, isUpdate: false, isDel: false})
    }

    // Handler
    const deleteHandler : EventHandler<any> = ()=>{
        setFetch({
            method: "delete",
            path: "/inventory/" + selectionModel[0],
            fetchFor: "inventory"
        })
        closeModalHandler()
    }

    return (
        <div className={"p-4"}>
            <ReturnPrevious/>
            <LoadingCover visible={isLoading} />
            <CusConfirmDialog confirmHandler={()=>deleteHandler(selectionModel)} open={modalControl.isDel}/>
            {(modalControl.isAdd || modalControl.isUpdate) &&
                <InventoryAdjustmentEdit
                    item={inventoryLogInit}
                    rerender={rerender}
                    isUpdate={modalControl.isUpdate}
                    isOpen={modalControl.isAdd || modalControl.isUpdate} closeHandler={closeModalHandler} type={serviceSelected || "inbound"}
                />}
            <h1>Inventory adjustments</h1>
            <hr/>
            <div className={"mt-6 grid grid-cols-4 min-h-[50px] gap-4"}>
                <div onClick={(e)=> {
                    selectService("inbound")
                    setAnchor(e.currentTarget)
                }}
                    className={"flex cursor-pointer relative active:text-black hover:text-black flex-col md:flex-row gap-4 w-full h-full bg-white transition-all p-4 rounded shadow hover:shadow-lg"}>
                    <div className={"p-1 text-xl rounded absolute -top-1 left-4 bg-sky-600"}>
                        <RxPinBottom color={"#ffffff"}/>
                    </div>
                    <p className={"mt-4"}>Inbound</p>
                </div>
                <div onClick={(e)=> {
                    selectService("outbound")
                    setAnchor(e.currentTarget)
                }}
                    className={"flex cursor-pointer relative active:text-black hover:text-black flex-col md:flex-row gap-4 w-full h-full bg-white transition-all p-4 rounded shadow hover:shadow-lg"}>
                    <div className={"p-1 text-xl rounded absolute -top-1 left-4 bg-rose-600"}>
                        <RxPinTop color={"#ffffff"}/>
                    </div>
                    <p className={"mt-4"}>Outbound</p>
                </div>
                <div onClick={(e)=> {
                    selectService("transfer")
                    setAnchor(e.currentTarget)
                }}
                    className={"flex cursor-pointer relative active:text-black hover:text-black flex-col md:flex-row gap-4 w-full h-full bg-white transition-all p-4 rounded shadow hover:shadow-lg"}>
                    <div className={"p-1 text-xl rounded absolute -top-1 left-4 bg-amber-500"}>
                        <RxSymbol color={"#ffffff"}/>
                    </div>
                    <p className={"mt-4"}>Transfer / Stores Transfer Request</p>
                </div>
            </div>
            <Menu open={Boolean(anchorEl)}
                onClose={handlerCloseMenu}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                }}
                  anchorEl={anchorEl}
            >
                <MenuItem onClick={()=>menuHandler()}>
                    Add new records
                </MenuItem>
            </Menu>
            <div className={"mt-10 bg-white p-4 rounded border"}>
                {
                    ilRows.length == 0 && <NoDataFound title={"No logs has found!"}/>
                }
                {ilRows.length > 0 &&
                    <>
                        <CusDataGridToolBar isSelecting={!!selectionModel[0]}
                                            fnAdd={()=>updateModalControl({isAdd:true, isUpdate:false, isDel: false})}
                                            fnDel={()=>updateModalControl({isAdd:false, isUpdate:false, isDel: true})}/>
                        <DataGrid columns={ilColumns} rows={ilRows}
                               components={{Toolbar: GridToolbarFilterButton}}
                               autoHeight
                              onSelectionModelChange={(newSelectionModel) => {setSelectionModel(newSelectionModel)}}
                            />
                    </>}
            </div>
        </div>
    );
};

export default InOutbound;