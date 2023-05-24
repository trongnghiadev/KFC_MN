import React, {EventHandler, useEffect, useReducer, useState} from 'react';
import {Autocomplete, AutocompleteChangeReason, Backdrop, Box, Button, Fade, Modal, TextField} from "@mui/material";
import CusBox from "../../../../components/CusBox/cusBox";
import {useForm} from "react-hook-form";
import useFetch, {fetchProps} from "../../../../Hooks/useFetch";
import CusConfirmDialog from "../../../../components/CusConfirmDialog/cusConfirmDialog";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";
import {useParams} from "react-router-dom";
import IInventoryLog from "../../../../Interfaces/inventoryLogs.interface";

export type ilEditProps = {
    item: IInventoryLog,
    rerender: Function,
    isUpdate: boolean,
    isOpen: boolean,
    closeHandler: Function,
    type: "inbound" | "outbound" | "transfer",
    reqNext?: Function
}

function ILEdit(props: ilEditProps) {
    // Props getter
    const {item, rerender, isUpdate, isOpen, closeHandler, type, reqNext} = props

    // React hook form handler
        const {register, handleSubmit, formState:{errors}} = useForm()
    // Form input reducers and input handler
        const [input, setInput] = useReducer((state: any, newState: any) => ({...state, ...newState}), {...item})

    const inputHandler = (evt: any, newVal?: any, inputName?:string, reason?:AutocompleteChangeReason | "input") => {
        let name: string = evt.target.id;
        let newValue = evt.target.value;
        console.log(reason)
        if (inputName == "from" && reason == "selectOption") {
            // @ts-ignore
            newValue = suppliers[name?.split("-")[2]]?.name;
            name = "from"
        }
        if (inputName == "to" && reason == "selectOption") {
            // @ts-ignore
            newValue = suppliers[name?.split("-")[2]]?.name;
            name = "to"
        }
        if (name === "state" && input.stock > 0) {
            newValue = newVal ? "available" : "unavailable";
            newValue = input.stock <= 0 ? "ofs" : newValue
        }
        setInput({...input, [name]: newValue});
    };
    // Get params
    const params = useParams()

    // Form actions and fetch data
    const [fetchOptions, setFetchOptions] = useState<fetchProps>({
        method: "get",
        path: "/ingredients/constants",
        fetchFor: "supplier"
    })

    const {data, isLoading, isError} = useFetch(fetchOptions)
    const [suppliers, setSuppliers] = useState<Array<{label:string, id: string}>>([])
    // Get data
    useEffect(()=>{
        // @ts-ignore
        if(data != null && fetchOptions.fetchFor == "supplier") setSuppliers(data.constants.suppliers)

        switch (fetchOptions.method){
            case "delete": case "post": case "put" :
                closeHandler();
                break;
            default:
                break;
        }
    }, [data])
    //Data handlers
    // - Delete handler comes with an own modal controller
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const deleteHandler : EventHandler<any> = ()=>{
        setFetchOptions({
            method: "delete",
            path: "/inventory/" + item.id,
            fetchFor: "inventory"
        })
    }
    // -- Update handler
    const updateHandler : EventHandler<any> = ()=>{
        const submitForm = new FormData();
        Object.keys(input).forEach((prop: string)=>{
            submitForm.append(prop, input[prop])
        })
        setFetchOptions({
            method: "put",
            sendData: submitForm,
            path: "/inventory/" + item.id
        })
        rerender()
        if (reqNext) reqNext()
    }
    // -- Add handler
    const addHandler : EventHandler<any> = ()=>{
        const submitForm = new FormData();
        Object.keys(input).forEach((prop: string)=>{
            submitForm.append(prop, input[prop])
        })
        submitForm.append("warehouseId", params.whId || "")
        setFetchOptions({
            method: "post",
            sendData: submitForm,
            path: "/inventory"
        })
        rerender()
        if (reqNext) reqNext()
    }
    // @ts-ignore
    return (
        <>
        <LoadingCover visible={isLoading} />
        <CusConfirmDialog confirmHandler={deleteHandler}
                          open={openDeleteConfirm}
                          closeHandler={() => setOpenDeleteConfirm(false)}
                          message={"Confirm to delete this item ?"}/>
        <Modal
                open={isOpen}
                onClose={()=>closeHandler()}
                className={"flex-all-center"}
                closeAfterTransition={true}
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpen}>
                        <div  className={"flex flex-col md:flex-row z-5"}>
                            <div className={"bg-white h-fit max-h-[90vh] w-[100%] z-10 flex flex-col md:flex-row justify-items-center"}>
                                <CusBox header={isUpdate ? "Update record detail" : "Add new record"} className={"relative w-[500px] max-w-[100%]"}>
                                    <Box component={"form"}>
                                        <Autocomplete
                                            id="from"
                                            options={suppliers.map((opt)=>opt.label)}
                                            onChange={(evt, newVal, reason)=>inputHandler(evt, newVal, "from", reason)}
                                            freeSolo
                                            {/* @ts-ignore */...{}}
                                            onInputChange={(evt, newVal, reason)=>inputHandler(evt, newVal, "from", reason)}
                                            renderInput={(params) => (
                                                <TextField margin={"normal"}
                                                           {...params}
                                                           label="From" contentEditable={true}/>)}
                                        />
                                        <Autocomplete
                                            id="to"
                                            options={suppliers.map((opt)=>opt.label)}
                                            onChange={(evt, newVal, reason)=>inputHandler(evt, newVal, "to", reason)}
                                            freeSolo
                                            {/* @ts-ignore */...{}}
                                            onInputChange={(evt, newVal, reason)=>inputHandler(evt, newVal, "to", reason)}
                                            renderInput={(params) => (
                                                <TextField margin={"normal"}
                                                           {...params}
                                                           label="To" contentEditable={true}/>)}
                                        />
                                    </Box>
                                    <div className={"flex gap-4 justify-between mt-6"}>
                                        {isUpdate && <Button color={"error"} variant={"outlined"} onClick={()=>setOpenDeleteConfirm(true)}>Delete</Button>}
                                        <div className={"flex gap-4"}>
                                            {!isUpdate &&
                                                <Button variant={"contained"} className={""} onClick={handleSubmit(addHandler)}>Next</Button>}
                                            {isUpdate &&
                                                <Button variant={"contained"} className={""} onClick={handleSubmit(updateHandler)}>Update</Button>}
                                            <Button variant={"contained"} className={""} onClick={()=>closeHandler()}
                                                    color={"success"}>Cancel</Button>
                                        </div>
                                    </div>
                                </CusBox>
                                <div className={"supplier h-fit bg-white p-6 w-[400px] max-w-[100%]"}>
                                    <h2>{(type !== "inbound")? "Delivery note" : "Received note"}</h2>
                                    <Box component={"form"}>
                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            defaultValue={input.note}
                                            id="note"
                                            label="Record's note"
                                            {...register("note")}
                                            rows={4}
                                            maxRows={9}
                                            multiline
                                            onChange={inputHandler}
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>
                </Fade>
            </Modal>
            </>
    );
}

export default ILEdit;