import React, {useEffect, useState} from 'react';
import useFetch from "../../../../Hooks/useFetch";
import {Link, useLocation, useParams} from "react-router-dom";
import ReturnPreviousBtn from "../../../../components/ReturnPrevious/returnPrevious";
import IWarehouse from "../../../../Interfaces/warehouse.interface";
import LoadingCover from "../../../../components/LoadingCover/loadingCover";
import WarehouseDetailChart from "./Charts/warehouseDetail";

const WarehouseDetail = () => {
    const {whId} = useParams();
    const {data, isLoading, isError} = useFetch({path: "/warehouse/"+whId});
    const [warehouse, setWarehouse] = useState<IWarehouse>();
    const location = useLocation()

    useEffect(()=>{
        //@ts-ignore
        if(data != null) setWarehouse(data.warehouse);
    }, [data])

    return (
        <main className={"p-4"}>
            <LoadingCover visible={isLoading}/>
            {!isLoading && <>
                <ReturnPreviousBtn/>
                <h2>{warehouse?.name}</h2>
                {warehouse && <WarehouseDetailChart warehouse={warehouse}/>}
                <hr className={"my-6"}/>
                <h3>Functions</h3>
                <div className={"gap-4 grid grid-cols-2 md:grid-cols-4"}>
                    <Link to={location.pathname + "/facility"}
                          className={"my-4 overflow-hidden h-[25vh] flex flex-col w-full bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
                        <p className={"p-6 font-semibold"}>Facility</p>
                        <img
                            src={'https://images.unsplash.com/photo-1602429438429-3def765b84d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=739&q=80'}
                            width={"100%"} height={"auto"} alt={"Inventory"}/>
                    </Link>
                    <Link to={location.pathname + "/storage"}
                          className={"my-4 overflow-hidden h-[25vh] flex flex-col w-full bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
                        <p className={"p-6 font-semibold"}>Ingredients</p>
                        <img
                            src={'https://images.unsplash.com/photo-1679775911898-c60d565e0f96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'}
                            width={"100%"} height={"auto"} alt={"Inventory"}/>
                    </Link>
                    <Link to={location.pathname + "/inventory-adjustments"}
                          className={"my-4 overflow-hidden h-[25vh] flex flex-col w-full bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
                        <p className={"p-6 font-semibold"}>Inventory adjustments</p>
                         <img
                            src={'https://images.unsplash.com/photo-1681396059178-72a46b4ec1ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'}
                            width={"100%"} height={"auto"} alt={"Inventory"}/>
                    </Link>
                </div>
            </>}
        </main>
    )
};

export default WarehouseDetail;