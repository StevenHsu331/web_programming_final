import React, { useEffect, useState } from "react";
import Header from '../Header'
import axios from '../../api'
import DayOffTable from "./DayOffTable";
import DayOffForm from "./DayOffForm";

const DayOffFrame = ({id, auth, setCoverShowed}) => {
    const [formOpen, setFormOpen] = useState(false);
    const [selfDataSource, setSelfDataSource] = useState([]);
    const [reviewDataSource, setReviewDataSource] = useState([]);
    const changeWindowStatus = () =>{
        setCoverShowed(!formOpen);
        setFormOpen(!formOpen);
    }

    useEffect(() => {
        const fetchData = async () =>{
            let dataSource = await getDataSource();
            setSelfDataSource(dataSource["self"]);
            setReviewDataSource(dataSource["review"]);
        }
        fetchData();
    }, [formOpen])

    const getDataSource = async () => {
        const {
            data: {status, message, result}
        } = await axios.get("/dayOff", {
            params: {
              id,
              auth,
            },
        });

        return await result;
    }

    return(
        <div className='inner-frame'>
            <DayOffForm id={id} formOpen={formOpen} changeWindowStatus={changeWindowStatus}></DayOffForm>
            <div className="row-container">
                <div className="row-item">
                    <Header title={"假期查詢/申請"} type={"inner"}></Header>
                    <div className='function-bar'>
                        <button className='btn btn-success' onClick={() => {changeWindowStatus()}}>請假</button>
                    </div>
                    <DayOffTable dataList={selfDataSource} dataTitleList={["", "applicant", "apply date time", "status"]} type={"self"}></DayOffTable>
                </div>
                {
                    auth != 2 ?
                        <div className="row-item">
                            <Header title={"假期審核"} type={"inner"}></Header>
                            <DayOffTable dataList={reviewDataSource} dataTitleList={["", "applicant", "apply date time", "action"]} type={"review"}></DayOffTable>
                        </div>
                    : <div/>
                }
            </div>
        </div>
    )
}

export default DayOffFrame;