import React, { useState, useEffect } from "react";
import Header from '../Header'
import axios from '../../api'
import NewBulletinForm from "./NewBulletinForm";
import BulletinTable from "./BulletinTable";

const BulletinFrame = ({id, auth, setCoverShowed}) => {
    const [formOpen, setFormOpen] = useState(false);
    const [users, setUsers] = useState([])

    const changeWindowStatus = () =>{
        setCoverShowed(!formOpen);
        setFormOpen(!formOpen);
    }

    useEffect(() => {
        const fetchData = async () =>{
            let users = await getUsers();
            setUsers(users);
        }

        fetchData();
    }, [formOpen])

    const getUsers = async () => {
        const {
            data: { status, message, users },
        } = await axios.get('/department/users');
        
        return await users;
    }

    return(
        <div className='inner-frame'>
            <Header title={"公告欄＆通知"} type={"inner"}></Header>
            {
                auth == 2 ? <div /> :
                <div className='function-bar'>
                    <button className='btn btn-success' onClick={() => {changeWindowStatus()}}>發佈公告</button>
                </div>
            }
            <NewBulletinForm users={users} formOpen={formOpen} changeWindowStatus={changeWindowStatus}></NewBulletinForm>
            <BulletinTable id={id} formOpen={formOpen}></BulletinTable>
        </div>
    )
}

export default BulletinFrame;