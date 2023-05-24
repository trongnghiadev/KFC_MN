import React from 'react';
import {Link, Route, Routes} from "react-router-dom";
import FnB from "./FnB/FnB";
import Supplier from "./Supplier/supplier";

const DefaultRoute = ()=>(<div className={"flex gap-4 flex-wrap "}>
    <Link to={"/data/fnb"} className={"my-4 overflow-hidden h-[25vh] flex flex-col w-[25vh] bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
        <p className={"p-6 font-semibold"}>F&B data</p>
        <img src={'https://i.pinimg.com/564x/ae/e9/a9/aee9a9b3a8381fd41f38ac7629783db0.jpg'} width={"100%"} height={"auto"} alt={""}/>
    </Link>
    <Link to={"/data/suppliers"} className={"my-4 overflow-hidden h-[25vh] flex flex-col w-[25vh] bg-white rounded-md shadow hover:shadow-lg hover:scale-[1.05] transition-all"}>
        <p className={"p-6 font-semibold"}>Supplier</p>
        <img src={'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80'} width={"100%"} height={"auto"} alt={""}/>
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
                    <Route path={"/suppliers"} element={<Supplier />}></Route>
                </Routes>

            </main>
        </>
    );
};

export default Data;