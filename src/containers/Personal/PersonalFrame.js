import React from "react";
import sha256 from 'sha256';
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../Header";
import axios from "../../api"

const PersonalFrame = ({id, name, number}) => {
    const [department, setDepartment] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [password, setPassword] = useState("");
    const passwordInput = useRef(null);
    const warningText = useRef(null);

    const setPasswordRef = useCallback((node) => {
        passwordInput.current = node;
    })

    const setWarningTextRef = useCallback((node) => {
        warningText.current = node;
    })

    useEffect(() => {
        const fetchData = async () => {
            let user = await getPersonalInfo();
            setDepartment(user[0].department_name);
            setIsManager(user[0].auth != 2);
        }

        fetchData();
    },[editPassword])

    const getPersonalInfo = async () =>{
        const {
            data: {status, message, user}
        } = await axios.get(`user/${id}`);

        return await user;
    }

    const verifyInput = () => {
        var status = true;
        if(password == ""){
            status = false;
            passwordInput.current.style.borderColor = "#ff0000";
        }
        else{
            passwordInput.current.style.borderColor = "#ced4da";
        }

        return status;
    }

    const submitChangePassword = async () =>{
        let encodedPassword = sha256(password);
        if(verifyInput()){
            warningText.current.style.display = "none";
            const {
                data: { status, message, userInfo },
            } = await axios.post('/user/change', {
                id,
                encodedPassword,
            });

            if(status){
                setEditPassword(false);
            }
            alert(message)
        }
        else{
            warningText.current.style.display = "block";
        }
    }
    
    return(
        <div className='inner-frame'>
            <Header title={"個人資訊"} type={"inner"}></Header>
            <div className='function-bar'>
                <button className={'btn btn-success' + (editPassword ? "" : " hidden")} onClick={() => {submitChangePassword()}}>確認變更</button>
                <button className={'btn '+(editPassword ? "btn-danger" : "btn-success")} onClick={() => {setEditPassword(!editPassword)}}>{editPassword ? "取消變更" : "變更密碼"}</button>
            </div>
            <div className="personal-form">
                <div className="form-group">
                    <label htmlFor="name">姓名</label>
                    <label id="name" className="form-control">{name}</label>
                </div>
                <div className="form-group">
                    <label htmlFor="number">員工編號</label>
                    <label id="number" className="form-control">{number}</label>
                </div>
                <div className="form-group">
                    <label htmlFor="department">部門</label>
                    <label id="department" className="form-control">{department}</label>
                </div>
                <div className="form-group">
                    <label htmlFor="password">密碼</label>
                    {
                        editPassword ? <input ref={setPasswordRef} id="password" type="password" className="form-control" onChange={(event) => {setPassword(event.target.value)}} />
                        : <label id="password" className="form-control">********</label>
                    }
                </div>
                <div className='form-group'>
                    <span ref={setWarningTextRef} className='hidden warning-text'>密碼不得為空！</span>
                </div>
            </div>
        </div>
    )
}

export default PersonalFrame;