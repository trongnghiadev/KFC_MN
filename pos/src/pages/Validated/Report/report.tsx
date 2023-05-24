import {TbMoneybag, TbReceipt2, TbReceiptOff, TbReportMoney} from "react-icons/tb";
import React, {useEffect, useMemo, useState} from "react";
import {IoFastFoodOutline} from "react-icons/io5";
import Orders from "../Orders/orders.tsx";
import useFetch, {fetchProps} from "../../../Hooks/useFetch.ts";

const Report = () => {
    const [orders, setOrders] = useState([])
    const [fetchOpt, setFetch] = useState<fetchProps>({
        method: "get",
        path: "/sale/orders",
        fetchFor: "All orders today",
        query: {filter: "getToday"}
    })
    const {data, isLoading, fetchFor} = useFetch(fetchOpt)

    const revenue = useMemo(()=>
            orders.length > 0 ? orders.reduce((rev, val)=>{
                if(val.state == "done") return rev + val.total
                return rev + 0;
            }, 0) : 0
    , [orders])

    const paidOrders = useMemo(()=>
            orders.length > 0 ? orders.reduce((order, val)=>{
                        if(val.state == "done") return order + 1
                        return order + 0;
                    }, 0) : 0
    , [orders])

    const itemSold = useMemo(()=>
            orders.length > 0 ? orders.reduce((count, val)=>{
                        if(val.state == "done") {
                            const foodAmount = val.foods.reduce((res, val)=> res + parseInt(val.amount), 0)
                            return count + foodAmount
                        }
                        return count + 0;
                    }, 0) : 0
    , [orders])

    const cancelOrder = useMemo(()=>
            orders.length > 0 ? orders.reduce((count, val)=>{
                        if(val.state == "cancel" && val.total > 0) {
                            return count + 1;
                        }
                        return count + 0;
                    }, 0) : 0
    , [orders])

    useEffect(()=>{
        if(data != null && fetchFor == "All orders today") {
            setOrders([...data.orders])

        }
        if(data != null && fetchFor == "complete order") setFetch(
        {
                method: "get",
                path: "/sale/orders",
                fetchFor: "All orders today",
                query: {filter: "getToday"}
            }
        )
    }, [data])


    return (
        <div className={"py-8"}>
            <h1 className={"text-2xl mb-2"}>Revenue report</h1>
            <p className={"text-sky-900 mb-8"}>{
                (new Date().toLocaleString("vi-VN", {
                                                          weekday: "long",
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
            }))}</p>
            <div className={"grid-cols-4 grid gap-4"}>
                <div
                    className={"bg-sky-200 rounded p-6 shadow hover:shadow-xl transition-all"}
                >
                    <div className={"rounded-full mb-10 bg-white  w-fit p-4 text-2xl"}>
                        <TbReportMoney/>
                    </div>
                    <h3 className={"font-medium"}>Revenue</h3>
                    <p className={"text-3xl"}>{revenue.toLocaleString()} VND</p>
                </div>
                <div
                    className={"bg-white rounded p-6 shadow hover:shadow-xl transition-all"}
                >
                    <div className={"rounded-full mb-10 bg-sky-200 w-fit p-4 text-2xl"}>
                        <TbReceipt2/>
                    </div>
                    <h3 className={"font-medium"}>Paid orders</h3>
                    <p className={"text-3xl"}>{paidOrders}</p>
                </div>
                <div
                    className={"bg-white rounded p-6 shadow hover:shadow-xl transition-all"}
                >
                    <div className={"rounded-full mb-10 bg-sky-200 w-fit p-4 text-2xl"}>
                        <IoFastFoodOutline/>
                    </div>
                    <h3 className={"font-medium"}>Item sold</h3>
                    <p className={"text-3xl"}>{itemSold}</p>
                </div>
                <div
                    className={"bg-white rounded p-6 shadow hover:shadow-xl transition-all"}
                >
                    <div className={"rounded-full mb-10 bg-orange-300 w-fit p-4 text-2xl"}>
                        <TbReceiptOff/>
                    </div>
                    <h3 className={"font-medium"}>Cancel orders</h3>
                    <p className={"text-3xl"}>{cancelOrder}</p>
                </div>
            </div>
            <div className={"h-[60vh]"}>
                <Orders blockFn={true}/>
            </div>
        </div>
    );
};

export default Report;