import React, {EventHandler, useEffect, useReducer, useState} from 'react';
import IIngredient, {IngredientUnit} from "../../../../Interfaces/ingredient.interface";
import {
    Autocomplete,
    AutocompleteChangeReason,
    Backdrop,
    Box,
    Button, capitalize,
    Checkbox,
    Fade,
    FormControlLabel,
    Modal,
    TextField
} from "@mui/material";
import CusBox from "../../../../components/CusBox/cusBox";
import {useForm} from "react-hook-form";
import useFetch, {fetchProps} from "../../../../Hooks/useFetch";
import CusConfirmDialog from "../../../../components/CusConfirmDialog/cusConfirmDialog";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";
import {useParams} from "react-router-dom";
import ISupplier from "../../../../Interfaces/supplier.interface";

export type ingredientEditProps = {
    ingredient: IIngredient,
    rerender: Function,
    isUpdate: boolean,
    isOpen: boolean,
    closeHandler: Function
}

function IngredientEdit(props: ingredientEditProps) {
    // Props getter
    const {ingredient, rerender, isUpdate, isOpen, closeHandler} = props

    // React hook form handler
        const {register, handleSubmit, formState:{errors}} = useForm()

    // Form input reducers and input handler
        const [input, setInput] = useReducer((state: any, newState: any) => ({...state, ...newState}), {...ingredient})

    const inputHandler = (evt: any, newVal?: any, inputName?:string, reason?:AutocompleteChangeReason) => {
        let name: string = evt.target.id;
        let newValue = evt.target.value;
        if (name.includes("unit")) {
            name = "unit"
            newValue = newVal
        }
        if (inputName == "supplier" && reason == "selectOption") {
            // @ts-ignore
            newValue = suppliers[name?.split("-")[2]]?.id;
            name = "supplierId"
        }
        if (name === "state" && input.stock > 0) {
            newValue = newVal ? "available" : "unavailable";
            newValue = input.stock <= 0 ? "ofs" : newValue
        }
        setInput({...input, [name]: newValue});

        if (inputName === "supplier" && reason != "clear") setFetchOptions({
            method: "get",
            path: "/suppliers/" + newValue,
            fetchFor: "supplier"
        })
        if (inputName === "supplier" && reason == "clear") setSelectSupplier(undefined)
    };

    // Rendering the supplier data need to be declared
    const [selectSupplier, setSelectSupplier] = useState<ISupplier|undefined>(ingredient.supplier)
    // Get params
    const params = useParams()

    // Form actions and fetch data
    const [fetchOptions, setFetchOptions] = useState<fetchProps>({
        method: "get",
        path: "/ingredients/constants",
        fetchFor: "constants"
    })

    const {data, isLoading, isError} = useFetch(fetchOptions)
    const [units, setUnit] = useState<Array<IngredientUnit>>([])
    const [suppliers, setSuppliers] = useState<Array<{label:string, id: string}>>([])
    // Get data
    useEffect(()=>{
        // Fetch for constants : Units and Suppliers' id list
        if(data != null && fetchOptions.fetchFor == "constants") {
            // @ts-ignore
            setUnit(data.constants.units)
            // @ts-ignore
            setSuppliers(data.constants.suppliers)
        }
        // @ts-ignore
        if(data != null && fetchOptions.fetchFor == "supplier") setSelectSupplier(data.supplier)

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
            path: "/ingredients/" + ingredient.id,
            fetchFor: "ingredient"
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
            path: "/ingredients/" + ingredient.id
        })
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
            path: "/ingredients"
        })
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
                                <CusBox header={isUpdate ? "Update an ingredient" : "Add new ingredient"} className={"relative w-[500px] max-w-[100%]"}>
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
                                            type='number'
                                            fullWidth
                                            defaultValue={input.cost}
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
                                            defaultValue={input.stock}
                                            id="stock"
                                            label="Stock"
                                            {...register("stock", {valueAsNumber: true})}
                                            error={!!errors.stock}
                                            helperText={(!!errors.stock && "On hand must a number!")}
                                            onChange={inputHandler}
                                        />
                                        <Autocomplete
                                            id="units"
                                            value={input.unit}
                                            defaultValue={"the"}
                                            options={units}
                                            onChange={(evt, val, reason)=>inputHandler(evt, val, reason)}
                                            disableClearable={true}
                                            renderInput={(params) => (
                                                <TextField margin={"normal"}
                                                           {...params}
                                                           label="Unit"/>)}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={input.stock <= 0}
                                                    checked={input.state == "available"}
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
                                <div className={"supplier h-fit bg-white p-6 w-[400px] max-w-[100%]"}>
                                    <h2>Supplier</h2>
                                    <Box component={"form"}>
                                        <Autocomplete
                                            id="supplier"
                                            options={suppliers.map((opt)=>opt.label)}
                                            onChange={(evt, newVal, reason)=>inputHandler(evt, newVal, "supplier", reason)}
                                            renderInput={(params) => (
                                                <TextField margin={"normal"}
                                                           {...params}
                                                           label="Supplier" contentEditable={false}/>)}
                                        />
                                    </Box>
                                    {selectSupplier && <div>
                                        <h3>Vendor : {selectSupplier.name}</h3>
                                        {Object.getOwnPropertyNames(selectSupplier).map((props)=> {
                                            // @ts-ignore
                                            return props != "name" && selectSupplier[props] &&(<p>{capitalize(props)}: {selectSupplier[props]}
                                            </p>)
                                        })}
                                    </div>}
                                </div>
                            </div>
                        </div>
                </Fade>
            </Modal>
            </>
    );
}

export default IngredientEdit;