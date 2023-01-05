import { useState, useRef, useCallback, useEffect} from 'react';
import sha256 from 'sha256';
import axios from '../../api';

function NewDepartmentForm({dataList, formOpen, changeWindowStatus}){
    const [parent, setParent] = useState("");
    const [name, setName] = useState("");
    const parentInput = useRef(null);
    const nameInput = useRef(null);
    const warningText = useRef(null);

    const setParentRef = useCallback((node) => {
        parentInput.current = node;
    })

    const setNameRef = useCallback((node) => {
        nameInput.current = node;
    })

    const setWarningTextRef = useCallback((node) => {
        warningText.current = node;
    })

    useEffect(()=>{
        setParent("");
        setName("");
        parentInput.current.selectedIndex = 0;
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
            const {
                data: { status, message },
            } = await axios.post('/department', {
                parent,
                name,
            });
            changeWindowStatus()
            alert(message)
        }
        else{
            warningText.current.style.display = "block";
        }
    }

    return (
        <div className={"pop-up-window"+ (formOpen ? "" : " hidden")}>
            <div className='pop-up-header'>
                <div className='form-group'>
                    <h4 className='title'>新增部門/組織</h4>
                </div>
            </div>
            <div className='pop-up-body'>
                <div className='form-group'>
                    <label htmlFor='parent'>上級部門</label>
                    <select ref={setParentRef} id='parent' className='form-control' onChange={(event) => {setParent(event.target.value)}}>
                    <option value="" >最上層</option>
                        {
                            dataList.map((o) => {
                                return <option key={("option-"+o.id)} value={o.id} >{o.name}</option>
                            })
                        }
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>部門名稱</label>
                    <input ref={setNameRef} id='name' type='text' className='form-control' onChange={(event) => {setName(event.target.value)}} />
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

export default NewDepartmentForm;