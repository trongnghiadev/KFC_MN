import {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import env from "../env";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export interface fetchProps {
    method?: "get" | "post" | "delete" | "put" | "head" | "patch"
    path: string,
    sendData?: object,
    query?: object,
    fetchFor?: string,
    reFetch?: boolean,
    isNotify? : boolean
}

export default function useFetch(props:fetchProps){
    const {path, method, sendData, query, reFetch, fetchFor} = props
    let {isNotify} = props
    const [data, setData] = useState(undefined);
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(undefined);

    isNotify = isNotify == undefined ? true : isNotify;
    // Toastify controller
    const toastId = useRef(null);
    // @ts-ignore
    const notify = (content:string)=> toastId.current = toast(content, {type: toast.TYPE.DEFAULT,autoClose: false})
    // @ts-ignore
    const toastSuccess = () => toast.update(toastId.current, {type: toast.TYPE.SUCCESS, autoClose: 800, render: "Success 👌"})
    // @ts-ignore
    const toastError = (e) => toast.update(toastId.current, {type: toast.TYPE.ERROR, autoClose: 800, render: e})
    const navigate = useNavigate()

    useEffect(()=>{
        if (path == "") return;
        (async function() {
            try {
                setLoading(true);
                if (method != "get" && isNotify){
                    notify("Working on it...");
                }
                const res = await axios({
                    method: method,
                    url: env.serverUrl + path,
                    data: sendData,
                    params: query
                })
                if (res.data.success == false && isNotify) setError(res.data.message)
                setData(res.data)
            } catch (e: any) {
                // @ts-ignore
                (async ()=>{setError(e.message)})()
                    .then(()=>{
                        if(e.code==403) navigate("/login", {replace:true})
                    if (isNotify) toastError(e.message)
                })
            } finally {
                setLoading(false)
                if (isError == null && isNotify) toastSuccess()
            }
        })()
    }, [path, method, sendData, reFetch, isNotify, navigate, isError])
    return {data, isLoading, isError, fetchFor}
}