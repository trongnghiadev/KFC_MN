import React, {EventHandler, useEffect, useReducer, useState} from 'react';
import ISupplier from "../../../../Interfaces/supplier.interface";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";
import CusConfirmDialog from "../../../../components/CusConfirmDialog/cusConfirmDialog";
import {
    Backdrop,
    Box,
    Button,
    Fade,
    Modal,
    TextField
} from "@mui/material";
import CusBox from "../../../../components/CusBox/cusBox";
import useFetch, {fetchProps} from "../../../../Hooks/useFetch";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";

export interface supplierEditProps {
    supplier?: ISupplier,
    closeHandler: Function,
    isOpen: boolean,
    isUpdate: boolean
}
function SupplierEdit(props:supplierEditProps) {
    // Props getter
    const {supplier, isUpdate, isOpen, closeHandler} = props

    // React hook form handler
        const {register, handleSubmit, formState:{errors}} = useForm()

    // Form input reducers and input handler
        const [input, setInput] = useReducer((state: any, newState: any) => ({...state, ...newState}), {...supplier})

    const inputHandler = (evt: any, newVal?: any, inputName?:string) => {
        let name: string = evt.target.id;
        let newValue = evt.target.value;
        setInput({...input, [name]: newValue});
    };

    // Get params
    const params = useParams()

    // Form actions and fetch data
    const [fetchOptions, setFetchOptions] = useState<fetchProps>({
        method: "get",
        path: "/suppliers",
        fetchFor: "Supplier"
    })

    const {data, isLoading, isError} = useFetch(fetchOptions)
    // Get data
    useEffect(()=>{
        switch (fetchOptions.method){
            case "delete": case "post": case "put":
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
            path: "/suppliers/" + supplier?.id,
            fetchFor: "Supplier"
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
            path: "/suppliers/" + supplier?.id
        })
    }
    // -- Add handler
    const addHandler : EventHandler<any> = ()=>{
        const submitForm = new FormData();
        Object.keys(input).forEach((prop: string)=>{
            submitForm.append(prop, input[prop])
        })
        setFetchOptions({
            method: "post",
            sendData: submitForm,
            path: "/suppliers"
        })
    }

    return (
        <>
        <LoadingCover visible={false}/>
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
                                <CusBox header={isUpdate ? "Update a supplier" : "Add new supplier"} className={"relative w-[500px] max-w-[100%]"}>
                                    <Box component={"form"}>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            defaultValue={input.name}
                                            id="name"
                                            label="Ingredient's name"
                                            {...register("name", {required: true})}
                                            error={!!errors.name}
                                            helperText={!!errors.name && "Name is required"}
                                            onChange={inputHandler}
                                        />
                                        <TextField
                                            margin="normal"
                                            type='email'
                                            fullWidth
                                            defaultValue={input.email}
                                            id="email"
                                            label="Email"
                                            {...register("email", {required: true, pattern: /^\S+@\S+$/i})}
                                            error={!!errors.cost}
                                            helperText={!!errors.cost && "Re-check the email!"}
                                            onChange={inputHandler}
                                        />
                                        <TextField
                                            margin="normal"
                                            type='text'
                                            fullWidth
                                            defaultValue={input.phone}
                                            id="phone"
                                            label="Phone number"
                                            {...register("phone", {pattern:/^[0-9+-]+$/, minLength: 6, maxLength: 12})}
                                            error={!!errors.phone}
                                            helperText={(!!errors.phone && "Phone number is not available")}
                                            onChange={inputHandler}
                                        />
                                        <TextField
                                            margin="normal"
                                            type='text'
                                            fullWidth
                                            defaultValue={input.description}
                                            id="description"
                                            label="Description"
                                            {...register("description")}
                                            onChange={inputHandler}
                                        />
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
                        </div>
                </Fade>
            </Modal>
        </>
    );
}

export default SupplierEdit;