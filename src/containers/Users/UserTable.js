import { useState, useEffect } from "react";
import axios from '../../api'
import UserTableRow from './UserTableRow'

const UserTable = ({formOpen}) => {
    const [userInfos, setUserInfos] = useState([]);

    useEffect(() => {
        const fetchData = async () =>{
            let users = await getUsers();
            setUserInfos(users);
        }

        fetchData();
    }, [formOpen])

    const getUsers = async () => {
        const {
            data: { status, message, users },
        } = await axios.get('/user');
        
        return await users;
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>name</th>
                    <th>employee num</th>
                    <th>department</th>
                    <th>is manager</th>
                </tr>
            </thead>
            <tbody>
            {
                userInfos.map((o, i) => {
                    return <UserTableRow key={i} detail={o} idx={i}></UserTableRow>
                })
            }
            </tbody>
        </table>
    )
}

export default UserTable;