import { useState, useRef, useCallback, useEffect} from 'react';
import sha256 from 'sha256';
import axios from '../../api';

function NewUserForm({formOpen, changeWindowStatus}){
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState("");
    const [isManager, setIsManager] = useState(false);
    const [name, setName] = useState("");
    const departmentInput = useRef(null);
    const isManagerInput = useRef(null);
    const nameInput = useRef(null);
    const warningText = useRef(null);

    const setDepartmentRef = useCallback((node) => {
        departmentInput.current = node;
    })

    const setIsManagerRef = useCallback((node) => {
        isManagerInput.current = node;
    })

    const setNameRef = useCallback((node) => {
        nameInput.current = node;
    })

    const setWarningTextRef = useCallback((node) => {
        warningText.current = node;
    })

    const getDepartments = async () =>{
        const {
            data: { status, message, departmentObject, departmentList },
        } = await axios.get('/department');
        
        return await departmentList;
    }

    useEffect(()=>{
        const fetchData = async () =>{
            let departments = await getDepartments();
            departmentInput.current.value = departments[0] ? departments[0].id : 1;
            setDepartment(departments[0] ? departments[0].id : 1);
            setDepartments(departments);
        }
        fetchData();
        setIsManager(false);
        setName("");
        departmentInput.current.selectedIndex = 0;
        isManagerInput.current.checked = false;
        nameInput.current.value = "";
    },[formOpen]);

    const verifyInput = () => {
        var status = true;
        if(name == ""){
            status = false;
            nameInput.current.style.borderColor = "#ff0000";
        }
        else{
            nameInput.current.style.borderColor = "#ced4da";
        }

        return status;
    }

    const submitForm = async () => {
        if(verifyInput()){
            warningText.current.style.display = "none";
            let defaultPwd = sha256('WebProgramming');
            console.log(department, isManager, name, defaultPwd)
            const {
                data: { status, message },
            } = await axios.post('/user', {
                department,
                isManager,
                name,
                defaultPwd
            });
            changeWindowStatus()
            alert(message)
        }
        else{
            warningText.current.style.display = "block";
        }
    }

    return (
        <div className={"pop-up-window form"+ (formOpen ? "" : " hidden")}>
            <div className='pop-up-header'>
                <div className='form-group'>
                    <h4 className='title'>新增帳號</h4>
                </div>
            </div>
            <div className='pop-up-body'>
                <div className='form-group'>
                    <label htmlFor='name'>員工名稱</label>
                    <input ref={setNameRef} id='name' type='text' className='form-control' onChange={(event) => {setName(event.target.value)}} />
                </div>
                <div className='form-group'>
                    <label htmlFor='department'>所屬部門</label>
                    <select ref={setDepartmentRef} id='department' className='form-control' onChange={(event) => {setDepartment(event.target.value)}}>
                        {
                            departments.map((o, i) => {
                                return <option key={i} value={o.id}>{o.name}</option>
                            })
                        }
                    </select>
                </div>
                <div className='form-check'>
                    <label htmlFor='isManager' className='form-check-label'>部門主管</label>
                    <input ref={setIsManagerRef} id="isManager" type='checkbox' className='form-check-input' onClick={() => {setIsManager(!isManager)}} />
                </div>
                <div className='form-group'>
                    <span ref={setWarningTextRef} className='hidden warning-text'>欄位不得為空！</span>
                </div>
                <div className='form-group form-footer'>
                    <button className='btn btn-dark col-4' onClick={() => {submitForm()}}>確認</button>
                    <button className='btn btn-dark col-4' onClick={() => {changeWindowStatus()}}>取消</button>
                </div>
            </div> 
        </div>
    )
}

export default NewUserForm;