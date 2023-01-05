import React, { useState } from "react";
import Header from '../Header'
import UserTable from "./UserTable";
import NewUserForm from "./NewUserForm";

const UserFrame = ({setCoverShowed}) => {
    const [formOpen, setFormOpen] = useState(false);
    const changeWindowStatus = () => {
        setCoverShowed(!formOpen);
        setFormOpen(!formOpen);
    }

    return(
        <div className='inner-frame'>
            <Header title={"使用者管理"} type={"inner"}></Header>
            <div className='function-bar'>
                <button className='btn btn-success' onClick={() => {changeWindowStatus()}}>新增帳號</button>
            </div>
            <NewUserForm formOpen={formOpen} changeWindowStatus={changeWindowStatus}></NewUserForm>
            <UserTable formOpen={formOpen}></UserTable>
        </div>
    )
}

export default UserFrame;