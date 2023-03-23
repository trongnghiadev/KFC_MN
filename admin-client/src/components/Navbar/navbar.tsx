import React, {useEffect, useState} from 'react';
import {HiChartPie, HiDatabase, HiLogout, HiUserCircle} from "react-icons/hi";
import styles from './navbar.module.css'
import {Link, useNavigate} from "react-router-dom";
import logoImg from "../../assets/logo.png"
import axios from "axios";
import env from "../../env";

const Navbar = () => {
    const [page, setPage] = useState(window.location.pathname);
    const navigate = useNavigate()
    useEffect(() => {
        setPage(window.location.pathname);
        if (!localStorage.getItem("uid")) navigate("/login");
    }, [window.location.pathname])

    const [user, setUser] = useState({name: ""})
    useEffect(()=>{
        axios({
            method: "get",
            url: env.serverUrl + "/users/" + localStorage.getItem("uid")
        }).then((res)=> setUser(res.data.user))
    }, [])

    return (
        <div
            className={"fixed left-0 top-0 rounded-r-md bg-white h-screen w-[15vw] gap-6 drop-shadow-md hidden sm:flex flex flex-col p-6 justify-between"}>
            {/*Main function*/}
            <div>
                <div className={"brandLogo mb-4"}><img src={logoImg} className={"rounded-sm"}/></div>
                <div className={"flex flex-col"}>
                    <Link to={'/'} className={"flex items-center " + styles[page == "/" ? "navActive" : "navItem"]}>
                        <HiChartPie className={"block mr-2"}/>
                        <div>Dashboard</div>
                    </Link>
                    <Link to={'/users'}
                          className={"flex items-center " + styles[page.includes("users") ? "navActive" : "navItem"]}>
                        <HiUserCircle className={"block mr-2"}/>
                        <div>Users</div>
                    </Link>
                    <Link to={'/data'}
                          className={"flex items-center " + styles[page.includes("data") ? "navActive" : "navItem"]}>
                        <HiDatabase className={"block mr-2"}/>
                        <div>Data</div>
                    </Link>
                </div>
            </div>
            {/*Sub function*/}
            <div>
                <div>
                    Welcome <br/>
                    <p className={"font-semibold text-xl"}>{user.name}</p>
                </div>
                <Link to={"/login"} className={"flex items-center " + styles.navItem} replace={true}>
                    <HiLogout className={"block mr-2"}></HiLogout>
                    <div>Logout</div>
                </Link>
            </div>

        </div>
    );
};

export default Navbar;