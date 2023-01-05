import { useState, useRef, useCallback, useEffect} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import sha256 from 'sha256';
import axios from '../../api';

function DayOffForm({id, formOpen, changeWindowStatus}){
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [content, setContent] = useState("");
    const contentInput = useRef(null);
    const warningText = useRef(null);

    const setContentRef = useCallback((node) => {
        contentInput.current = node;
    })

    const setWarningTextRef = useCallback((node) => {
        warningText.current = node;
    })

    useEffect(() => {
        setContent("");
        contentInput.current.value = "";
    },[formOpen]);

    const verifyInput = () => {
        var status = true;
        if(content == ""){
            status = false;
            contentInput.current.style.borderColor = "#ff0000";
        }
        else{
            contentInput.current.style.borderColor = "#ced4da";
        }

        return status;
    }

    const submitForm = async () => {
        if(verifyInput()){
            warningText.current.style.display = "none";
            let beginStr = startDate.toISOString().split("T")[0]
            let endStr = endDate.toISOString().split("T")[0]
            console.log(beginStr);
            console.log(endStr)
            const {
                data: { status, message },
            } = await axios.post('/dayOff/request', {
                id,
                content,
                beginStr,
                endStr
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
                    <label htmlFor='content'>內容</label>
                    <textarea ref={setContentRef} id='content' className='form-control' onChange={(event) => {setContent(event.target.value)}} />
                </div>
                
                <div className='form-group'>
                    <label htmlFor='date'>請假日期</label>
                    <div id='date'>
                        <DatePicker id='date-begin' dateFormat="yyyy-MM-dd" selected={startDate} minDate={new Date()} maxDate={endDate} onChange={(date) => setStartDate(date)} />
                        <DatePicker id='date-end' dateFormat="yyyy-MM-dd" selected={endDate} minDate={startDate} onChange={(date) => setEndDate(date)} />
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

export default DayOffForm;