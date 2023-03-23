import React, {EventHandler, useEffect, useReducer, useState} from 'react';
import {DataGrid, GridColDef, GridSelectionModel, GridToolbarFilterButton} from '@mui/x-data-grid';
import axios from "axios";
import env from "../../../env";
import {Autocomplete, Backdrop, Box, Button, Checkbox, Fade, FormControlLabel, Modal, TextField} from "@mui/material";
import CusBox from "../../../components/CusBox/cusBox";
import CusDataGridToolBar from "../../../components/CusDataGridToolBar/cusDataGridToolBar";
import {toast} from "react-toastify";
import CusConfirmDialog from "../../../components/CusConfirmDialog/cusConfirmDialog";

const UserRoles = ["admin", "wh", "sale", "hr", "other"]

const Users = () => {
    const [users, setUsers] = useState([]);


    // Form reducer handler
    const reducerInit = {
        email: "",
        name: "",
        password: "123456",
        role: "other",
        activate: true,
        locked: false,
        method: '',
        openForm: false,
        openBlockedConfirm: false,
        openDeleteConfirm: false
    }
    const [userFormInput, setUserFormInput] = useReducer(
        (state: any, newState: any) => ({...state, ...newState}),
        reducerInit
    );

    // Fetch table users
    useEffect(() => {
        axios.get(env.serverUrl + "/users")
            .then((res) => {
                setUsers(res.data.users)
            })
    }, [userFormInput])


    //User form input handlers
    const handleInput = (evt: any, newVal?: any) => {
        let name: string = evt.target.id;
        let newValue = evt.target.value;
        if (newVal) newValue = newVal
        if (name.includes("role")) name = "role"
        if (name === "activate") newValue = !userFormInput.activate
        setUserFormInput({[name]: newValue});
    };

    // Table and column of grid data
    const usersTableColumns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 100},
        {field: 'name', headerName: 'Name', width: 200},
        {field: 'email', headerName: 'Email', width: 200},
        {field: 'role', headerName: 'Role', width: 100},
        {field: 'state', headerName: 'State', width: 150},
    ];

    const usersTableRows = users.map((user: any) => ({...user}))

    const [userSelectedModel, setUserSelectedModel] = useState<GridSelectionModel>([]);

    // Fetch data functions
    const createNewUserHandler: EventHandler<any> = (e) => {
        toast.promise(
            axios.post(
                env.serverUrl + '/users',
                {...userFormInput, state: userFormInput.activate ? "available" : "unavailable"}
            ),
            {
                success: "Created successfully",
                pending: "Verifying data",
                error: {
                    render({data}) {
                        // @ts-ignore
                        return data.response.data.message
                    }
                }
            }
        )
            .then((res) => setUserFormInput({...reducerInit}))
    }
    const editUserHandler = () => {
        toast.promise(axios({
            method: "get",
            url: env.serverUrl + "/users/" + userSelectedModel[0]
        }), {
            pending: "Just a sec"
        }).then((res) => {
            const data = res.data.user
            setUserFormInput({
                email: data.email,
                name: data.name,
                password: "",
                role: data.role,
                activate: data.state == "available",
                locked: data.state == "block",
                method: 'put',
                openForm: true
            })
        })
    }

    const updateUserHandler = () => {
        toast.promise(axios({
                method: "put",
                url: env.serverUrl + "/users/" + userSelectedModel[0],
                data: {...userFormInput, state: userFormInput.activate ? "available" : "unavailable"}
            }),
            {
                success: "Updated successfully",
                pending: "Verifying data",
                error: {
                    render({data}) {
                        // @ts-ignore
                        return data.response.data.message
                    }
                }
            })
            .then(() => {
                setUserFormInput(reducerInit)
            })
    }

    const blockUserHandler = () => {
        toast.promise(axios({
                method: "put",
                url: env.serverUrl + "/users/" + userSelectedModel[0],
                data: {state: "blocked", currentId: localStorage.getItem("uid")}
            }),
            {
                success: "Blocked successfully",
                pending: "Verifying data",
                error: {
                    render({data}) {
                        // @ts-ignore
                        return data.response.data.message
                    }
                }
            })
            .then(() => {
                setUserFormInput({openBlockedConfirm: false})
            })
    }

    const deleteUserHandler = () => {
        toast.promise(
            axios({
                method: "delete",
                data: {
                    "uid": localStorage.getItem("uid")
                },
                url: env.serverUrl + "/users/" + userSelectedModel[0]
            }),
            {
                success: "Deleted successfully",
                pending: "Verifying data",
                error: {
                    render({data}) {
                        // @ts-ignore
                        return data.response.data.message
                    }
                }
            })
            .then(() => {
                setUserFormInput({openDeleteConfirm: false})
            })
    }
    return (
        <>
            <CusConfirmDialog confirmHandler={blockUserHandler}
                              open={userFormInput.openBlockedConfirm}
                              closeHandler={() => setUserFormInput({openBlockedConfirm: false})}
                              message={"Confirm to block this user ?"}/>
            <CusConfirmDialog confirmHandler={deleteUserHandler}
                              open={userFormInput.openDeleteConfirm}
                              closeHandler={() => setUserFormInput({openDeleteConfirm: false})}
                              message={"Confirm to delete this user ?"}/>
            <Modal
                open={userFormInput.openForm}
                onClose={() => setUserFormInput({...reducerInit})}
                className={"flex-all-center"}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={userFormInput.openForm}>
                    <div className={"bg-white w-[50vw] md:max-w-[30vw] h-fit max-h-[50vh] z-10"}>
                        <CusBox header={userFormInput.method == "post" ? "Add new user" : "Update user"}>
                            <Box component={"form"}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    defaultValue={userFormInput.name}
                                    id="name"
                                    label="User's name"
                                    name="name"
                                    autoFocus
                                    onChange={handleInput}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    id={"email"}
                                    defaultValue={userFormInput.email}
                                    fullWidth
                                    label="Email address"
                                    name="email"
                                    onChange={handleInput}
                                />
                                <TextField
                                    margin="normal"
                                    required={userFormInput.method != "put"}
                                    fullWidth
                                    id={"password"}
                                    defaultValue={userFormInput.password}
                                    label="Password (default 123456)"
                                    type="password"
                                    name="password"
                                    onChange={handleInput}
                                    disabled={userFormInput.method == "put"}
                                />
                                <Autocomplete
                                    id="role"
                                    value={userFormInput.role}
                                    defaultValue={userFormInput.role}
                                    options={UserRoles}
                                    onChange={handleInput}
                                    renderInput={(params) => (
                                        <TextField margin={"normal"}
                                                   {...params}
                                                   label="Role"/>)}
                                />
                                <FormControlLabel
                                    control={<Checkbox checked={userFormInput.activate} onChange={handleInput}
                                                       name={"activate"} id={"activate"}/>}
                                    label="Activate this user ?"/>
                            </Box>
                            <div className={"flex gap-4 justify-end"}>
                                {userFormInput.method == "post" &&
                                    <Button onClick={createNewUserHandler} variant={"contained"}>Add</Button>}
                                {userFormInput.method == "put" &&
                                    <Button onClick={updateUserHandler} variant={"contained"}>Update</Button>}
                                <Button variant={"contained"} onClick={() => setUserFormInput({...reducerInit})}
                                        color={"error"}>Cancel</Button>
                            </div>
                        </CusBox>
                    </div>
                </Fade>

            </Modal>
            <main className={"p-6"}>
                <h1>Users manager</h1>
                <hr className={"mb-4"}/>
                <div className={"flex flex-col"}>
                    <Button onClick={() => {
                        setUserFormInput({openForm: true, method: "post"})
                    }} variant={"contained"} className={"w-fit self-end"}>Add user</Button>
                    <div className={"my-4 min-h-[400px] bg-white p-6 rounded-md shadow"}>
                        <h2>Users list</h2>
                        <CusDataGridToolBar
                            fnEdit={editUserHandler}
                            isSelecting={!!userSelectedModel[0]}
                            fnLock={() => setUserFormInput({openBlockedConfirm: true})}
                            fnDel={() => setUserFormInput({openDeleteConfirm: true})}
                        />
                        <DataGrid
                            columns={usersTableColumns}
                            rows={usersTableRows}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            components={{Toolbar: GridToolbarFilterButton}}
                            autoHeight
                            onSelectionModelChange={(newSelection) => setUserSelectedModel(newSelection)}
                            selectionModel={userSelectedModel}
                        />
                    </div>
                </div>
            </main>
        </>
    );
};

export default Users;