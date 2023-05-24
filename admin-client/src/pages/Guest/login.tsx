import React, {useEffect, useReducer} from 'react';
import {Button, TextField} from "@mui/material";
import {toast} from "react-toastify";
import axios from "axios";
import env from "../../env";
import {useNavigate} from "react-router-dom";
import cover from "../../assets/cover.jpg"

const loginStyle = {
    backgroundImage: `url(${cover})`,
    backgroundPosition: "center",
    backgroundOrigin: "center",
    backgroundSize: "cover"
}

const Login = () => {

    const navigator = useNavigate();

    const [input, updateInput] = useReducer((state: any, newState: any) => ({...state, ...newState}),
        {
            email: "",
            password: ""
        }
    )

    useEffect(()=>{
        localStorage.removeItem("accessToken")
        delete axios.defaults.headers.common['Authorization'];
    })

    const signInHandler = () => {
        const loginFn = axios({
            method: "post",
            data: {...input, app: "admin"},
            url: env.serverUrl + "/auth/login"
        })

        toast.promise(loginFn, {
            pending: 'Logging in',
            success: 'Success',
            error: {
                render({data}) {
                    // @ts-ignore
                    return data.response.data.message ? data.response.data.message : "Unknown error, contact for some help!";
                }
            }
        }).then((res) => {
            if (res.data.success) {
                localStorage.setItem("accessToken", res.data.accessToken)
                localStorage.setItem("uid", res.data.uid)
            }
        })
            .finally(()=>
                navigator('/'))
    }

    return (
        <div>
            <section className="transition-all"  style={loginStyle}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div
                        className="w-full bg-white rounded-lg shadow max-w-[500px]">
                        <h1 className="text-center my-6 text-3xl font-bold text-blue-500">
                            KFC CMS
                        </h1>
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <TextField type="email" name="email" id="email" label={"Your email"}
                                               className="bg-gray-50 border border-gray-300 text-white rounded-lg w-full p-2.5"
                                               placeholder="name@company.com" required
                                               onChange={(e) => updateInput({email: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <TextField type="password" name="password" id="password" label={"Your password"}
                                               className="bg-gray-50 border border-gray-300 text-white rounded-lg w-full p-2.5"
                                               required
                                               onChange={(e) => updateInput({password: e.target.value})}
                                    />
                                </div>
                                <Button variant={"contained"} onClick={signInHandler}
                                        className="w-full text-white bg-primary-600">
                                    Sign in
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;