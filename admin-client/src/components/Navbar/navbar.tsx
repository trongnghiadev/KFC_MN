import React, {useEffect, useState} from 'react';
import {HiChartPie, HiDatabase, HiLogout, HiUserCircle} from "react-icons/hi";
import {MdInventory} from "react-icons/md"
import styles from './navbar.module.css'
import {Link, useNavigate} from "react-router-dom";
import logoImg from "../../assets/logo.png"
import axios from "axios";
import env from "../../env";
import {RxCaretLeft} from "react-icons/rx";
import { motion } from 'framer-motion';
const Navbar = () => {
    const [page, setPage] = useState(window.location.pathname);
    const navigate = useNavigate()
    useEffect(() => {
        setPage(window.location.pathname);
        if (!localStorage.getItem("accessToken")) navigate("/login");
    }, [window.location.pathname])

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("accessToken")}`;
    })

    const [user, setUser] = useState({name: ""})
    useEffect(()=>{
        axios({
            method: "get",
            url: env.serverUrl + "/users/current"
        }).then((res)=> setUser(res.data.user))
    }, [])
    const [animateCall, setAnimateCall] = useState({collapseBtn: {rotate: 0, top: 20}, isCollapse: false})

    return (
        <motion.div
            className={" rounded-r-md bg-white h-screen gap-6 drop-shadow-md hidden sm:flex flex-col p-6 justify-between "}
            animate={{width: animateCall.isCollapse ? 60 : 250, padding: animateCall.isCollapse ? 4 : 24}}
        >

            {/*Collapse button*/}
            <motion.div animate={{rotate: animateCall.collapseBtn.rotate}} className={"bg-sky-200 cursor-pointer w-fit p-1 rounded-sm absolute -right-2"}
                onClick={()=>setAnimateCall((prev)=>
                    // Rotate 180 -> 0 and so all
                    ({...prev, collapseBtn: {rotate: 180 - prev.collapseBtn.rotate, top: prev.isCollapse ? 30:20}, isCollapse: !prev.isCollapse}))
            }
            ><RxCaretLeft/></motion.div>
            {/*Main function*/}
            <div>
                <motion.div
                    animate={{visibility: animateCall.isCollapse ? "hidden"  :"visible"}}
                    className={"brandLogo mb-4"}><img src={logoImg} className={"rounded-sm"} alt={"KFC"}/></motion.div>
                <div className={"flex flex-col"}>
                    <Link to={'/'} className={"flex items-center gap-2 " + styles[page == "/" ? "navActive" : "navItem"]}>
                        <HiChartPie className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Dashboard</motion.div>
                    </Link>
                    <Link to={'/users'}
                          className={"flex items-center gap-2 "+ styles[page.includes("users") ? "navActive" : "navItem"]}>
                        <HiUserCircle className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Users</motion.div>
                    </Link>
                    <Link to={'/data'}
                          className={"flex item-center gap-2 "+ styles[page.includes("data") ? "navActive" : "navItem"]}>
                        <HiDatabase className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Data</motion.div>
                    </Link>
                    <Link to={'/inventory'}
                          className={"flex items-center gap-2 " + styles[page.includes("inventory") ? "navActive" : "navItem"]}>
                        <MdInventory className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Inventory</motion.div>
                    </Link>
                </div>
            </div>
            {/*Sub function*/}
            <div>
                <div className={animateCall.isCollapse ? "hidden" : ""}>
                    Welcome <br/>
                    <p className={"font-semibold text-xl"}>{user.name}</p>
                </div>
                <Link to={"/login"} className={"flex items-center " + styles.navItem} replace={true}>
                    <HiLogout className={"block " + animateCall.isCollapse ? "" : "mr-2"}></HiLogout>
                    <div className={animateCall.isCollapse ? "hidden" : ""}>Logout</div>
                </Link>
            </div>

        </motion.div>
    );
};

export default Navbar;