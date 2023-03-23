import React, {useEffect, useState} from 'react';
import {Card, CardHeader} from "@mui/material";
import {Link, Route, Routes} from "react-router-dom";
import FnB from "./FnB/FnB";

const DefaultRoute = ()=>(<div className={"flex gap-4 flex-wrap "}>
    <Link to={"/data/fnb"} className={"my-4 overflow-hidden h-[25vh] flex flex-col w-[25vh] bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
        <p className={"p-6 font-semibold"}>F&B data</p>
        <img src={'https://i.pinimg.com/564x/ae/e9/a9/aee9a9b3a8381fd41f38ac7629783db0.jpg'} width={"100%"} height={"auto"}/>
    </Link>
    <Link to={"/"} className={"my-4 overflow-hidden h-[25vh] flex flex-col w-[25vh] bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
        <p className={"p-6 font-semibold"}>Facilities</p>
    </Link>
    <Link to={"/"} className={"my-4 overflow-hidden h-[25vh] flex flex-col w-[25vh] bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
        <p className={"p-6 font-semibold"}>Supplier</p>
    </Link>
</div>)

const Data = () => {

    return (
        <>

            <main className={"p-6"}>
                <h1>Data & resources manager</h1>
                <hr className={"mb-4"}/>
                <Routes>
                    <Route path={"/"} element={<DefaultRoute/>}/>
                    <Route path={"/fnb"} element={<FnB />}></Route>
                </Routes>

            </main>
        </>
    );
};

export default Data;