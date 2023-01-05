import { useState, useRef, useCallback, useEffect} from 'react';
import sha256 from 'sha256';
import axios from '../../api';

function NewBulletinForm({users, formOpen, changeWindowStatus}){
    const [departments, setDepartments] = useState([]);
    const [department, setDepartment] = useState("");
    const [departmentUsers, setDepartmentUsers] = useState([]);
    const [targets, setTargets] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isHovered, setIsHover] = useState(false);
    const departmentInput = useRef(null);
    const targetInput = useRef(null);
    const titleInput = useRef(null);
    const contentInput = useRef(null);
    const warningText = useRef(null);

    const setDepartmentRef = useCallback((node) => {
        departmentInput.current = node;
    })

    const setTargetRef = useCallback((node) => {
        targetInput.current = node;
    })

    const setTitleRef = useCallback((node) => {
        titleInput.current = node;
    })

    const setContentRef = useCallback((node) => {
        contentInput.current = node;
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

    const getDepartmentUsers = async () =>{
        const {
            data: { status, message, users },
        } = await axios.get(`department/users/${department}`);
        
        return await users;
    }

    useEffect(() => {
        const fetchData = async () =>{
            let departmentUsers = await getDepartmentUsers();
            setDepartmentUsers(departmentUsers);
        }

        fetchData();
    }, [department])

    useEffect(() => {
        const fetchData = async () =>{
            let departments = await getDepartments();
            departmentInput.current.value = departments[0].id;
            setDepartment(departments[0].id);
            setDepartments(departments);
        }
        fetchData();
        setTitle("");
        setContent("");
        setTargets([]);
        departmentInput.current.selectedIndex = 0;
        titleInput.current.value = "";
        contentInput.current.value = "";
    },[formOpen]);

    const addToTargets = (status, value) => {
        let newTargets = [...targets];
        if(status){
            newTargets.forEach((o, i) => {
                if(o.id == value.id){
                    newTargets.splice(i, 1);
                    return;
                }
            })
            newTargets.push(value);
        }
        else{
            newTargets.forEach((o, i) => {
                if(o.id == value.id){
                    newTargets.splice(i, 1);
                    return;
                }
            })
        }
        setTargets(newTargets);
    }

    const verifyInput = () => {
        var status = true;
        if(title == ""){
            status = false;
            titleInput.current.style.borderColor = "#ff0000";
        }
        else{
            titleInput.current.style.borderColor = "#ced4da";
        }
        if(content == ""){
            status = false;
            contentInput.current.style.borderColor = "#ff0000";
        }
        else{
            contentInput.current.style.borderColor = "#ced4da";
        }
        if(targets.length == 0){
            status = false;
            targetInput.current.style.borderColor = "#ff0000";
        }
        else{
            targetInput.current.style.borderColor = "#ced4da";
        }

        return status;
    }

    const submitForm = async () => {
        if(verifyInput()){
            warningText.current.style.display = "none";
            const {
                data: { status, message },
            } = await axios.post('/bulletin', {
                title,
                content,
                targets,
            });
            changeWindowStatus();
            alert(message)
        }
        else{
            warningText.current.style.display = "block";
        }
    }

    return (
        <div className={"pop-up-window pop-up-window-lg form"+ (formOpen ? "" : " hidden")}>
            <div className='pop-up-header'>
                <div className='form-group'>
                    <h4 className='title'>發佈公告/通知</h4>
                </div>
            </div>
            <div className='pop-up-body'>
                <div className='form-group'>
                    <label htmlFor='title'>標題</label>
                    <input ref={setTitleRef} id='title' type='text' className='form-control' onChange={(event) => {setTitle(event.target.value)}} />
                </div>
                <div className='form-group'>
                    <label htmlFor='content'>內容</label>
                    <textarea ref={setContentRef} id='content' className='form-control' onChange={(event) => {setContent(event.target.value)}} />
                </div>
                <div className='form-group'>
                    <div className='form-group'>
                        <label htmlFor='department'>發布對象及所屬部門</label>
                        {isHovered ? 
                            <div htmlFor='department' className="hover-block">
                                {
                                    targets.map((o, i) => {
                                        return (
                                            <div key={"selected-"+i}>
                                                <span>{(o.employee_num + " " + o.name)}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                             : 
                            <div />
                        }
                        <select 
                            ref={setDepartmentRef} 
                            id='department' 
                            className='form-control' 
                            onChange={(event) => {setDepartment(event.target.value)}}
                            onMouseEnter={()=>{setIsHover(true)}} 
                            onMouseLeave={()=>{setIsHover(false)}}
                        >
                            {
                                departments.map((o, i) => {
                                    return <option key={i} value={o.id}>{o.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div ref={setTargetRef} id='target' className='form-control checkbox-frame'>
                        {
                            departmentUsers.map((o, i)=>{
                                return(
                                    <div key={o.id+"frame"} className='form-check'>
                                        <input key={o.id+"check"} id={o.id+"check"} className="form-check-input" value={JSON.stringify(o)} type="checkbox" onChange={(event) => {addToTargets(event.target.checked, JSON.parse(event.target.value))}}></input>
                                        <label key={o.id+"label"} htmlFor={(o.id+"check")} className="form-check-label">{(o.employee_num+" "+o.name)}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
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

export default NewBulletinForm;