export interface IFacilities {
    id: string | undefined,
    name: string,
    amount: string,
    cost: string,
    issue_amount: string | null,
    state: "available" | "unavailable" | "blocked",
    supplierId: string | null,
    unit: "the",
    image: string | undefined
}

import React, {EventHandler} from 'react';

type FacilityDetailProps = {
    item:IFacilities,
    onClick?: EventHandler<any>
}

const FacilityDetails = (props:FacilityDetailProps) => {
    const {item, onClick} = props;
    return (
        <div onClick={onClick} className={"my-4 cursor-pointer overflow-hidden h-650px flex flex-col justify-between w-full bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
            <img src={item.image} width={"100%"} height={"auto"} alt={item.name} className={item.image ? "" : "hidden"}/>
            <p className={"px-6 pt-4 font-semibold w-full overflow-hidden text-ellipsis"}>{item.name}</p>
            <div className={"px-6 py-4 flex gap-2 justify-between flex-wrap"}>
                <div className={"text-gray-500"}>Store:{item.amount} {item.unit == "the" ? "" : item.unit}</div>
                <div className={"text-gray-500 capitalize"}>{item.state}</div>
            </div>
        </div>
    );
};

export default FacilityDetails;