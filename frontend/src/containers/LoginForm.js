import { useState, useRef, useCallback} from 'react';
import sha256 from 'sha256';
import axios from '../api';

function LoginForm({employeeNum, setId, setAuth, setIsLogin, setEmployeeNum, setEmployeeName}){
    const [password, setPassword] = useState("");
    const employeeNumInput = useRef(null);
    const passwordInput = useRef(null);
    const warningText = useRef(null);

    const setEmployeeNumRef = useCallback((node) => {
        employeeNumInput.current = node;
    })

    const setPasswordRef = useCallback((node) => {
        passwordInput.current = node;
    })

    const setWarningTextRef = useCallback((node) => {
        warningText.current = node;
    })

    const verifyInput = () => {
        var status = true;
        if(employeeNum == ""){
            status = false;
            employeeNumInput.current.style.borderColor = "#ff0000";
        }
        else{
            employeeNumInput.current.style.borderColor = "#ced4da";
        }
        if(password == ""){
            status = false;
            passwordInput.current.style.borderColor = "#ff0000";
        }
        else{
            passwordInput.current.style.borderColor = "#ced4da";
        }

        return status;
    }

    const submitForm = async () => {
        let encodedPassword = sha256(password);
        if(verifyInput()){
            warningText.current.style.display = "none";
            const {
                data: { status, message, userInfo },
            } = await axios.post('/login', {
                employeeNum,
                encodedPassword,
            });
            if(status){
                setIsLogin(status);
                setAuth(userInfo.auth);
                setId(userInfo.id);
                setEmployeeNum(userInfo.employeeNum);
                setEmployeeName(userInfo.employeeName);
            }
            else{
                alert(message)
            }
        }
        else{
            warningText.current.style.display = "block";
        }
    }

    return (
        <div className='outer-center'>
            <div className='login-form'>
                <div className='form-header'>
                    <div className='form-group'>
                        <h3 className='title'>帳號登入</h3>
                    </div>
                </div>
                <div className='form-body'>
                    <div className='form-group'>
                        <label htmlFor='employeeNum'>員工代號</label>
                        <input ref={setEmployeeNumRef} id='employeeNum' type='text' className='form-control' onChange={(event) => {setEmployeeNum(event.target.value)}} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>密碼</label>
                        <input ref={setPasswordRef} id='password' type='password' className='form-control' onChange={(event) => {setPassword(event.target.value)}} />
                    </div>
                    <div className='form-group'>
                        <span ref={setWarningTextRef} className='hidden warning-text'>欄位不得為空！</span>
                    </div>
                    <div className='form-group'>
                        <button className='btn btn-dark form-control' onClick={() => {submitForm()}}>登入</button>
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default LoginForm;