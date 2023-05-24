import React, {EventHandler} from 'react';
import ISupplier from "../../../../Interfaces/supplier.interface";
import {HiMail, HiPhone} from "react-icons/hi";
export interface supplierItemProps {
    supplier:ISupplier,
    onClick?: EventHandler<any>
}
function SupplierItem(props:supplierItemProps) {
    const {supplier: item, onClick} = props
    return (
        <div
            onClick={onClick}
            className={"rounded-sm h-fit bg-white p-4 shadow hover:scale-[1.05] hover:shadow-xl transition-all cursor-pointer"}>
            <h2 className={""}>{item.name}</h2>
            <p className={"text-sm mb-2"}><HiMail/>{item.email}</p>
            <p className={"text-sm"}><HiPhone/>{item.phone}</p>
        </div>
    );
}

export default SupplierItem;