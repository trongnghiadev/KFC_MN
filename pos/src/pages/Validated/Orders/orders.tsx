import {useEffect, useState} from "react";
import useFetch, {fetchProps} from "../../../Hooks/useFetch.ts";
import IReceipt from "../../../interfaces/receiptInterface.ts";
import {motion} from "framer-motion";
import {Button} from "@mui/material";

const OrderItem = (props: {order: IReceipt, index: number, fetcher: CallableFunction, isBlock: boolean})=>{
    const {order, index, fetcher, isBlock} = props

    const time = new Date(order.create_at).toLocaleString("vi-VN", {timeZone: "Asia/Ho_Chi_Minh"})

    const state = order.state
    let colorFlag;

    const [openEdit, setOpenEdit] = useState(false)

    switch (state) {
        case "paid": default:
            colorFlag = "border-yellow-400"
            break;
        case "cancel":
            colorFlag = "border-red-700"
            break;
        case "done":
            colorFlag = "border-green-400"
            break;
    }
    return (
        <div className={"relative w-full"}>
            <div className={"bg-white w-full p-6 rounded shadow hover:shadow-xl border-t-8 transition-all cursor-pointer"+ " " + colorFlag}
                onClick={()=> state == "paid" && !isBlock && setOpenEdit(prev => !prev)}
            >
                        <p>{state == "paid" ? "Kitchen → Deliver" : state == "done" ? "Finished" : "Cancel"}</p>
                        <h2>#{index.toString().padStart(4, "0")}</h2>
                        <p className={"mb-2"}>{time}</p>
                        <code>
                            {
                                order.foods.map((food)=>(
                                    <div key={food.id} className={"flex gap-2 justify-between"}>
                                        <span>{food.name}</span>
                                        <span>x{food.amount}</span>
                                    </div>
                                ))
                            }
                        </code>
                        <p  className={"mt-4 text-right"}>
                            Total : {(order.total).toLocaleString(undefined, {minimumFractionDigits: 0})} VND
                        </p>
            </div>
            <motion.div className={"absolute top-0 -right-3 z-20 transform-all flex-col gap-0.5"}
                animate={{
                    display: openEdit ? "flex" : "none",
                    opacity: openEdit ? 1 : 0
                }}
            >
                <button className={"p-4 bg-green-600 text-white font-semibold rounded"}
                    onClick={()=>{
                        fetcher({
                            method: "patch",
                            path: "/sale/order/" + order.id,
                            query: {action: "done"},
                            fetchFor: "complete order"
                        })
                        setOpenEdit(false)
                    }}
                >Finish order</button>
                <button className={"p-4 bg-orange-500 text-white font-semibold rounded"}
                    onClick={()=>{
                        fetcher({
                            method: "patch",
                            path: "/sale/order/" + order.id,
                            query: {action: "cancel"},
                            fetchFor: "complete order"
                        })
                        setOpenEdit(false)
                    }}
                >Cancel order</button>
            </motion.div>
            {openEdit && <div className={"w-screen h-screen fixed z-10"}
                onClick={()=>setOpenEdit(false)}
            >
            </div>}
        </div>
    )
}

const Orders = (props: {blockFn?: boolean}) => {
    let {blockFn} = props
    if (blockFn == undefined) blockFn = false;
    const [orders, setOrders] = useState([])
    const [fetchOpt, setFetch] = useState<fetchProps>({
        method: "get",
        path: "/sale/orders",
        fetchFor: "All orders today",
        query: {filter: "getToday"}
    })
    const {data, isLoading, fetchFor} = useFetch(fetchOpt)

    useEffect(()=>{
        if(data != null && fetchFor == "All orders today") setOrders([...data.orders])
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
        <div className={"py-6 relative h-full"}>
            <h1 className={"text-3xl mb-6"}>Orders</h1>
            {orders.length > 0 && <div className={"grid grid-cols-5 gap-4 max-h-full overflow-y-scroll pr-4"}>
                {
                    orders.length > 0 && orders.map((order, i) => (
                        <OrderItem isBlock={blockFn} fetcher={setFetch} order={order} index={orders.length - i} key={i}/>))
                }
            </div>}
            {
                orders.length == 0 && <p>
                    There is no order yet.
                </p>
            }
        </div>
    );
};

export default Orders;