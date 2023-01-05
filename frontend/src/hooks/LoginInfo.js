import { useState } from 'react';
import axios from '../api'

const useLoginInfo = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [employeeNum, setEmployeeNum] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [id, setId] = useState("");
    const [auth, setAuth] = useState(2);

    const checkLogin = async () =>{
        const {
            data: {result}
        } = await axios.get("/login");

        if(result.isLogin){
            setIsLogin(true);
            setAuth(result.auth);
            setEmployeeNum(result.employeeNum);
            setEmployeeName(result.employeeName);
            setId(result.id);
        }
    }

    checkLogin();

    return {isLogin, employeeNum, employeeName, id, auth, setIsLogin, setEmployeeNum, setEmployeeName, setId, setAuth};
}

export default useLoginInfo;