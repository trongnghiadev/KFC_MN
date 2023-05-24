import React, {useEffect, useState} from 'react';
import {Autocomplete, Backdrop, Box, Button, Checkbox, Fade, FormControlLabel, Modal, TextField} from "@mui/material";
import CusBox from "../../../../components/CusBox/cusBox";
import NoImgFound from "../../../../components/NoImgFound/noImgFound";
import IWarehouse, {warehouseInit} from "../../../../Interfaces/warehouse.interface";
import {useForm} from "react-hook-form";
import axios from "axios";
import env from "../../../../env";
import {fetchProps} from "../../../../Hooks/useFetch";


type editWarehouseProps = {
    openForm:boolean,
    closeHandler: Function,
    isUpdate: boolean,
    item: IWarehouse,
    reRender: any
}

const WarehouseEdit = (props:editWarehouseProps) => {
    let {openForm, closeHandler, isUpdate, item, reRender} = props
    const {register, handleSubmit, formState:{errors}} = useForm()

    const [warehouse, setWarehouse] = useState<IWarehouse>(item)
    console.log(warehouse)
    const inputHandler = (evt:any , newVal?: any) => {
        let name: string = evt.target.id;
        let newValue = evt.target.value;
        if (name.includes("unit")) {
            name = "unit"
            newValue = newVal
        }
        if (name === "state") newValue = newVal ? "active" : "inactive"
        if (name === "image") {
            // Preview image before upload
            newValue = evt.target.files[0];
        }
        setWarehouse({...warehouse, [name]: newValue});
    }

    // Handlers
    function addHandler() {
        const submitForm = new FormData();
        Object.keys(warehouse).forEach((prop)=>{
            //@ts-ignore
            submitForm.append(prop, warehouse[prop])
        })
        axios({
            method: "post",
            url: env.serverUrl + "/warehouse",
            data: submitForm
        }).then((res) => closeHandler())
            .finally(()=>reRender())
    }

    function updateHandler() {
        const submitForm = new FormData();
        Object.keys(warehouse).forEach((prop)=>{
            //@ts-ignore
            submitForm.append(prop, warehouse[prop])
        })
        axios({
            method: "put",
            url: env.serverUrl + "/warehouse/"+warehouse.id,
            data: submitForm
        }).then((res) => closeHandler())
            .finally(()=>reRender())
    }


    function deleteHandler(){
        axios({
            method: "delete",
            url: env.serverUrl + "/warehouse/"+warehouse.id
        }).then((res) => closeHandler())
            .finally(()=>reRender())
    }
    return (
        <>
            <Modal
                open={openForm}
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
                <Fade in={openForm}>
                    <div  className={"flex flex-col md:flex-row"}>
                        <div className={"bg-white w-[800px] max-w-[90vw] h-fit max-h-[90vh] z-10"}>
                            <CusBox header={isUpdate ? "Update a facility item" : "Add new facility item"}>
                                <Box component={"form"}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        defaultValue={warehouse.name}
                                        id="name"
                                        label="Warehouse's name"
                                        {...register("name", {required: true})}
                                        error={!!errors.name}
                                        helperText={!!errors.name && "Name is required"}
                                        onChange={inputHandler}
                                    />
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        defaultValue={warehouse.address}
                                        id="address"
                                        label="Address"
                                        onChange={inputHandler}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={warehouse.state == "active"}
                                                onChange={inputHandler}
                                                name={"state"} id={"state"}
                                            />}
                                        label="Activate this item ?"/>
                                </Box>
                                <div className={"flex gap-4 justify-between mt-6"}>
                                    <div className={"flex gap-4"}>
                                        {isUpdate &&
                                            <Button variant={"outlined"} color={"error"} className={""} onClick={handleSubmit(deleteHandler)}>Delete</Button>}
                                        {!isUpdate &&
                                            <Button variant={"contained"} className={""} onClick={handleSubmit(addHandler)}>Add</Button>}
                                        {isUpdate &&
                                            <Button variant={"contained"} className={""} onClick={handleSubmit(updateHandler)}>Update</Button>}
                                        <Button variant={"contained"} className={""} onClick={()=>closeHandler()}
                                                color={"success"}>Cancel</Button>
                                    </div>
                                </div>
                            </CusBox>
                        </div>
                    </div>
                </Fade>

            </Modal>
        </>
    );
};

export default WarehouseEdit;