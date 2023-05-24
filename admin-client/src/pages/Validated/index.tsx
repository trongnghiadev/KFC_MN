import React, {useEffect} from 'react';
import Navbar from "../../components/Navbar/navbar";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./dashboard";
import Users from "./Users/users";
import Data from "./Data/data";
import Inventory from "./Inventory/inventory";
import axios from "axios";

const Pages = () => {
    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("accessToken")}`;
    })
    return (
        <div className={"bg-[#f5f7f9] w-screen min-h-screen relative flex gap-6"}>
            <Navbar/>
            <div className={"flex-grow pr-4 h-screen overflow-y-scroll"}>
                <Routes>
                    <Route path={"/"} element={<Dashboard/>}/>
                    <Route path={"/users"} element={<Users/>}/>
                    <Route path={"/data/*"} element={<Data/>}/>
                    <Route path={"/inventory/*"} element={<Inventory/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default Pages;