import React, {EventHandler, useReducer, useState} from 'react';
import { Backdrop, Box, Button, Checkbox, Fade, FormControlLabel, Modal, TextField} from "@mui/material";
import CusBox from "../../../../../components/CusBox/cusBox";
import {IFacilities} from "../facilityDetails";
import axios from "axios";
import env from "../../../../../env";
import NoImgFound from "../../../../../components/NoImgFound/noImgFound";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
import CusConfirmDialog from "../../../../../components/CusConfirmDialog/cusConfirmDialog";
import useFetch, {fetchProps} from "../../../../../Hooks/useFetch";
import {useParams} from "react-router-dom";

type editFacilityProps = {
    openForm:boolean,
    closeHandler: Function,
    isUpdate: boolean,
    item: IFacilities,
    reRender: any
}

const EditFacility = (props: editFacilityProps) => {

    //TODO:Fix not re rendering the page after alternate the data!

    const {openForm,closeHandler,isUpdate,item, reRender} = props
    const {register, handleSubmit, formState:{errors}} = useForm()

    const [facilityStates, setFacilityStates] = useReducer((state: any, newState: any) => ({...state, ...newState}), {
        ...item
    })

    const [fetchOptions, setFetchOptions] = useState<fetchProps>({
        method: "get",
        sendData: undefined,
        path: "",
        reFetch: true
    })

    const {data, isLoading, isError} = useFetch({...fetchOptions})
    const params = useParams();

    //@ts-ignore
    const previewImage = (facilityStates.image) instanceof File ? URL.createObjectURL(facilityStates.image) : facilityStates.image;

    const inputHandler = (evt: any, newVal?: any) => {
        let name: string = evt.target.id;
        let newValue = evt.target.value;
        if (name.includes("unit")) {
            name = "unit"
            newValue = newVal
        }
        if (name === "state") newValue = newVal ? "available" : "unavailable"
        if (name === "image") {
            // Preview image before upload
            newValue = evt.target.files[0];
        }
        setFacilityStates({...facilityStates, [name]: newValue});
    };
// Data handlers
    const updateHandler : EventHandler<any> = ()=>{
        const submitForm = new FormData();
        Object.keys(facilityStates).forEach((prop: string)=>{
            submitForm.append(prop, facilityStates[prop])
        })
        submitForm.append("warehouseId", params.whId || "")
        toast.promise(axios({
            method: 'put',
            url: env.serverUrl + "/facilities/" + facilityStates.id,
            data: submitForm
        }), {
            pending: "Validating information 😉",
            success: "Updated information 👌",
            error: {
                render({data}) {
                    // @ts-ignore
                    return data.response.data.message
                }
            }
        }).then(() => closeHandler()).finally(()=>reRender());
    }
    const addHandler : EventHandler<any> = () =>{
        const submitForm = new FormData();
        Object.keys(facilityStates).forEach((prop: string)=>{
            submitForm.append(prop, facilityStates[prop])
        })
        submitForm.append("warehouseId", params.whId || "")
        toast.promise(axios({
            method: 'post',
            url: env.serverUrl + "/facilities",
            data: submitForm
        }), {
            pending: "Validating information 😉",
            success: "Added new facility 👌",
            error: {
                render({data}) {
                    // @ts-ignore
                    return data.response.data.message
                }
            }
        }).then(()=>closeHandler()).finally(()=>reRender());
    }

    const deleteHandler : EventHandler<any> = () => {
        toast.promise(axios({
            method: 'delete',
            url: env.serverUrl + "/facilities/" + facilityStates.id,
        }), {
            pending: "Loading 💫",
            success: "Deleted 😶‍🌫️",
            error: {
                render({data}) {
                    // @ts-ignore
                    return data.response.data.message
                }
            }
        }).then(()=>closeHandler()).finally(()=>reRender());
    }

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    return (
        <>
            <CusConfirmDialog confirmHandler={deleteHandler}
                              open={openDeleteConfirm}
                              closeHandler={() => setOpenDeleteConfirm(false)}
                              message={"Confirm to delete this item ?"}/>
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
                        <div className={"bg-white w-[50vw] md:max-w-[30vw] h-fit max-h-[90vh] z-10"}>
                            <CusBox header={isUpdate ? "Update a facility item" : "Add new facility item"}>
                                <Box component={"form"}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        defaultValue={facilityStates.name}
                                        id="name"
                                        label="Facility's name"
                                        {...register("name", {required: true})}
                                        error={!!errors.name}
                                        helperText={!!errors.name && "Name is required"}
                                        onChange={inputHandler}
                                    />
                                    <TextField
                                        margin="normal"
                                        type='number'
                                        fullWidth
                                        defaultValue={facilityStates.cost}
                                        id="cost"
                                        label="Cost (VND)"
                                        {...register("cost", {min: 0})}
                                        error={!!errors.cost}
                                        helperText={!!errors.cost && "Cost must be >= 0"}
                                        onChange={inputHandler}
                                    />
                                    <TextField
                                        margin="normal"
                                        type='number'
                                        fullWidth
                                        defaultValue={facilityStates.amount}
                                        id="amount"
                                        label="Amount"
                                        {...register("amount", {pattern: /^\d+$/})}
                                        error={!!errors.amount}
                                        helperText={(!!errors.amount && "Amount must be a positive integer (Such as 1, 0, 100)")}
                                        onChange={inputHandler}
                                    />
                                    <TextField
                                        margin="normal"
                                        type='number'
                                        fullWidth
                                        defaultValue={facilityStates.issue_amount}
                                        id="issue_amount"
                                        label="Issue amount"
                                        {...register("issue_amount", {max: facilityStates.amount, min: 0})}
                                        error={!!errors.amount}
                                        helperText={!!errors.issue_amount ? (errors.issue_amount.type == "min" ? "Amount must be >= 0" : "Amount issued much be <= total amount") : undefined}
                                        onChange={inputHandler}
                                    />
                                    <div className="w-full">
                                        <label htmlFor={"img"}>Upload image</label>
                                        <input id="image" name={"image"} type="file" accept="image/*" className="w-full my-2"
                                               onChange={inputHandler}/>
                                    </div>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={facilityStates.state == "available"}
                                                onChange={inputHandler}
                                                name={"state"} id={"state"}
                                            />}
                                        label="Activate this item ?"/>
                                </Box>
                                <div className={"flex gap-4 justify-between mt-6"}>
                                    {isUpdate && <Button color={"error"} variant={"outlined"} onClick={()=>setOpenDeleteConfirm(true)}>Delete</Button>}
                                    <div className={"flex gap-4"}>
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
                        <div className={"bg-white w-[25vw] max-h-[90vh] z-10 p-6 relative"}>
                            {
                                !facilityStates.image && <NoImgFound/>
                            }{
                                facilityStates.image && <img className={"w-full object-cover"} src={previewImage} alt={facilityStates.name}/>
                            }
                        </div>
                    </div>
                </Fade>

            </Modal>
            </>
    );
};

export default EditFacility;