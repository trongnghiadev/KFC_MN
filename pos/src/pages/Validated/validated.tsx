import {useEffect} from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/navbar.tsx";
import {Route, Routes} from "react-router-dom";
import Home from "./Home/home.tsx";
import {useSelector} from "react-redux";
import {cartSplice, selectCart} from "../../store/reducers/cartReducers.ts";
import Orders from "./Orders/orders.tsx";
import Reports from "./Report/report.tsx"

const Validated = () => {
    const cart = useSelector(selectCart)

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("accessToken")}`;
    })
    return (
        <>
        <div className={"bg-[#f5f7f9] w-screen min-h-screen relative flex gap-6"}>
            <Navbar/>
            <div className={"flex-grow pr-4 h-screen overflow-y-scroll overflow-hidden"}>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/orders"} element={<Orders/>} />
                    <Route path={"/reports"} element={<Reports />} />
                </Routes>
            </div>
        </div>
        </>
    );
};

export default Validated;