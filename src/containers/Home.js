import { useEffect, useState } from 'react';
import SideBarFrame from './SideBar/SideBarFrame'
import BulletinFrame from './Bulletin/BulletinFrame'
import CheckInFrame from './CheckIn/CheckInFrame'
import DayOffFrame from './DayOff/DayOffFrame'
import DepartmentFrame from './Department/DepartmentFrame'
import PersonalFrame from './Personal/PersonalFrame'
import UserFrame from './Users/UserFrame'
import axios from '../api';

function Ｈome({id, auth, employeeNum, employeeName, setCoverShowed, setIsLogin}){
    const [currentPage, setCurrentPage] = useState("");
    const [pageMap, setPageMap] = useState({});

    useEffect(() => {
        auth == 0 ? setPageMap({
            "department": <DepartmentFrame setCoverShowed={setCoverShowed}/>,
            "user": <UserFrame setCoverShowed={setCoverShowed}/>
        }) : auth == 1 ? setPageMap({
            "bulletin": <BulletinFrame id={id} auth={auth} setCoverShowed={setCoverShowed}/>,
            "checkIn": <CheckInFrame id={id} auth={auth}/>,
            "dayOff": <DayOffFrame id={id} auth={auth} setCoverShowed={setCoverShowed}/>,
            "department": <DepartmentFrame setCoverShowed={setCoverShowed}/>,
            "personal": <PersonalFrame id={id} name={employeeName} number={employeeNum}/>,
            "user": <UserFrame setCoverShowed={setCoverShowed}/>
        }) : setPageMap({
            "bulletin": <BulletinFrame id={id} auth={auth} setCoverShowed={setCoverShowed}/>,
            "checkIn": <CheckInFrame id={id} auth={auth}/>,
            "dayOff": <DayOffFrame id={id} auth={auth} setCoverShowed={setCoverShowed}/>,
            "personal": <PersonalFrame id={id} name={employeeName} number={employeeNum}/>,
        })

        auth == 0 ? setCurrentPage("user") : auth == 1 ? setCurrentPage("bulletin") : setCurrentPage("bulletin")
    }, [auth])

    const changePage = (page) => {
        setCurrentPage(page);
    }

    return (
        <div className='body-frame'>
            <SideBarFrame auth={auth} currentPage={currentPage} changePage={changePage} setIsLogin={setIsLogin}></SideBarFrame>
            {pageMap[currentPage]}
        </div>
    )
}

export default Ｈome;