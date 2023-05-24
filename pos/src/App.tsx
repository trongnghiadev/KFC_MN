import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./pages/Login/login.tsx";
import {ToastContainer} from "react-toastify";
import Validated from "./pages/Validated/validated.tsx";
import 'react-toastify/dist/ReactToastify.css';
function App() {
    const router = createBrowserRouter([
        {
            path: "*",
            element: <Validated/>

        },
        {
            path: "/login",
            element: <Login/>,
        }
    ]);
    return (
        <div className="App">
            <ToastContainer/>
            <RouterProvider router={router}/>
        </div>
    )
}

export default App
