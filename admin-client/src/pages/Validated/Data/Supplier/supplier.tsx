import React, {useEffect, useState} from 'react';
import useFetch, {fetchProps} from "../../../../Hooks/useFetch";
import ISupplier, {initSupplier} from "../../../../Interfaces/supplier.interface";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";
import {Button} from "@mui/material";
import ReturnPrevious from "../../../../components/ReturnPrevious/returnPrevious";
import SupplierItem from "./supplierItem";
import SupplierEdit from "./supplierEdit";
import NoDataFound from "../../../../components/NoDataFound/noDataFound";

function Supplier() {

    const [fetchOption, setFetchOption] = useState<fetchProps>({
        method: "get",
        path: "/suppliers",
        fetchFor: "Supplier",
        reFetch: false
    })
    const {data, isLoading, fetchFor} = useFetch(fetchOption)

    const [suppliers, setSuppliers] = useState<Array<ISupplier>>([])
    const [selectedItem, setSelected] = useState<ISupplier>(initSupplier)
    useEffect(()=>{
        // @ts-ignore
        if (data != null && fetchFor == "Supplier") setSuppliers(data.suppliers)
    }, [data])

    const [formControl, updateFormControl] = useState({isUpdate: false, isOpen: false})

    function closeHandler(){
        updateFormControl({
            isOpen: false,
            isUpdate: false
        })

        setSelected(initSupplier)

        setFetchOption((prev) => ({...prev, reFetch: !prev.reFetch}))
    }

    function setupAddModal(){
        updateFormControl({
            isOpen: true,
            isUpdate: false
        })

        setSelected(initSupplier)
    }

    function setupUpdateModal(supplier:ISupplier){
        setSelected(supplier)
        updateFormControl({
            isUpdate: true,
            isOpen: true
        })
    }

    return (
        <>
            <div>
                <LoadingCover visible={isLoading}/>
                {formControl.isOpen && <SupplierEdit supplier={selectedItem} closeHandler={closeHandler} isOpen={formControl.isOpen} isUpdate={formControl.isUpdate}/>}
                <h2 className={"mb-4"}>Suppliers & Vendors</h2>
                <div className={"flex w-full justify-between"}>
                    <ReturnPrevious/>
                    <Button variant={"contained"} color={"primary"}
                        onClick={()=>setupAddModal()}
                    >+ Add</Button>
                </div>
                {suppliers.length > 0 && <div className={"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                    {
                        suppliers.map((sup) => <SupplierItem key={sup.id} supplier={sup}
                                                             onClick={() => setupUpdateModal(sup)}
                        />)
                    }
                </div>}
                {
                    suppliers.length == 0 && <NoDataFound title={"There is no supplier or vendor found!"} addHandler={setupAddModal}/>
                }
            </div>
        </>
    );
}

export default Supplier;