import {useEffect, useState} from 'react';
import {HiHome, HiLogout} from "react-icons/hi";
import styles from './navbar.module.css'
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import env from "../../env";
import {RxCaretLeft} from "react-icons/rx";
import { motion } from 'framer-motion';
import {FaReceipt, FaThList} from "react-icons/fa";
import Clock from "../Clock/clock.tsx";
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
            className={"rounded-r-md bg-white h-screen gap-6 drop-shadow-md hidden sm:flex md:flex flex-col p-6 justify-between relative"}
            animate={{width: animateCall.isCollapse ? 60 : 250, padding: animateCall.isCollapse ? 4 : 24}}
        >

            <div>
                <div className={"flex flex-col"}>
                    {/*Collapse button*/}
                        <motion.div animate={{rotate: animateCall.collapseBtn.rotate}} className={`bg-sky-200 justify-center flex cursor-pointer p-3 rounded-sm -right-2 mb-2 ${animateCall.isCollapse ? " w-full" : "absolute w-fit"}`}
                            onClick={()=>setAnimateCall((prev)=>
                                // Rotate 180 -> 0 and so all
                                ({...prev, collapseBtn: {rotate: 180 - prev.collapseBtn.rotate, top: prev.isCollapse ? 30:20}, isCollapse: !prev.isCollapse}))
                        }
                        ><RxCaretLeft/></motion.div>
                    {/*Main function*/}
                    <Link to={'/'} className={"flex items-center gap-2 " + styles[page == "/" ? "navActive" : "navItem"]}>
                        <HiHome className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Home</motion.div>
                    </Link>
                    <Link to={'/orders'}
                          className={"flex items-center gap-2 "+ styles[page.includes("orders") ? "navActive" : "navItem"]}>
                        <FaReceipt className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Orders</motion.div>
                    </Link>
                    <Link to={'/reports'}
                          className={"flex items-center gap-2 "+ styles[page.includes("reports") ? "navActive" : "navItem"]}>
                        <FaThList className={"block "}/>
                        <motion.div
                            animate={{display: animateCall.isCollapse ? "none" : "block"}}
                        >Reports</motion.div>
                    </Link>
                </div>
            </div>
            {/*Sub function*/}
            <div className={animateCall.isCollapse ? "hidden" : ""}>
                <Clock/>
                <div >
                    Welcome
                    <p className={"font-semibold text-xl"}>
                        {user.name}</p>
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