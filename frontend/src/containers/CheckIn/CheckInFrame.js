import React, { useEffect, useState } from "react";
import Header from '../Header';
import axios from '../../api';
import CheckInTable from "./CheckInTable";

const CheckInFrame = ({id, auth}) => {
    const [keyword, setKeyword] = useState("");
    const [checkInDS, setCheckInDS] = useState([]);
    const [doUpdate, setDoUpdate] = useState(false);

    useEffect(() =>{
        const fetchData = async () =>{
            let checkInDSTemp = await getRecord();
            setCheckInDS(checkInDSTemp);
        }

        fetchData();
    }, [doUpdate])

    const checkIn = async () =>{
        const {
            data: {status, message}
        } = await axios.post(`/checkIn/${id}`);
        setDoUpdate(!doUpdate);
        alert(message);
    }

    const checkOut = async () =>{
        const {
            data: {status, message}
        } = await axios.post(`/checkOut/${id}`);
        setDoUpdate(!doUpdate);
        alert(message);
    }

    const getRecord = async () =>{
        const {
            data: {status, message, result}
        } = await axios.get(`/checkIn/search/${id}`);

        return await result;
    }

    const getSearchRecode = async () =>{
        const {
            data: {status, message, result}
        } = await axios.get(`/checkIn/search`,{
            params: {
                keyword
            }
        });

        return await result;
    }

    const detectKeyword = async (event) =>{
        if(event.keyCode == 13){
            let checkInDSTemp = await getSearchRecode();
            setCheckInDS(checkInDSTemp);
        }
        else{
            setKeyword(event.target.value);
        }
    }

    return(
        <div className='inner-frame'>
            <Header title={"打卡記錄"} type={"inner"}></Header>
            <div className='function-bar'>
                <button className='btn btn-success col-6' onClick={() => {checkOut()}}>下班</button>
                <button className='btn btn-success col-6' onClick={() => {checkIn()}}>上班</button>
            </div>
            {
                auth != 2 ? 
                <div className="form-group">
                    <input id="search" className="form-control" placeholder="seach by employee num or name..." onKeyUp={(event) => {detectKeyword(event)}}/>
                </div>:
                <div/>
            }
            <CheckInTable checkInDS={checkInDS}></CheckInTable>
        </div>
    )
}

export default CheckInFrame;