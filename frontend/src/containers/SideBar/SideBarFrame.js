import React from "react";
import { useState, useEffect} from 'react';
import SideBar from './SideBar'
import axios from '../../api'

const SideBarFrame = ({auth, currentPage, changePage, setIsLogin}) => {
    const [sidebarItems, setSidebarItems] = useState([]);

    useEffect(() => {
        auth == 0 ? setSidebarItems([
            {title: "組織圖", value:"department",action: () => changePage("department")},
            {title: "使用者管理", value:"user",action: () => changePage("user")},
            {title: "登出", value:"logout",action: () => logout()},
        ]) : auth == 1 ? setSidebarItems([
            {title: "公告欄＆通知", value:"bulletin", action: () => changePage("bulletin")},
            {title: "打卡記錄", value:"checkIn", action: () => changePage("checkIn")},
            {title: "假期查詢", value:"dayOff",action: () => changePage("dayOff")},
            {title: "組織圖", value:"department",action: () => changePage("department")},
            {title: "個人資料", value:"personal",action: () => changePage("personal")},
            {title: "使用者管理", value:"user",action: () => changePage("user")},
            {title: "登出", value:"logout",action: () => logout()},
        ]) : setSidebarItems([
            {title: "公告欄＆通知", value:"bulletin", action: () => changePage("bulletin")},
            {title: "打卡記錄", value:"checkIn", action: () => changePage("checkIn")},
            {title: "假期查詢", value:"dayOff",action: () => changePage("dayOff")},
            {title: "個人資料", value:"personal",action: () => changePage("personal")},
            {title: "登出", value:"logout",action: () => logout()},
        ])
    }, [auth])

    useEffect(()=>{

    }, [currentPage])

    const logout = async () =>{
        const {
            data: {status, message}
        } = await axios.get("/logout")
        setIsLogin(false)
    }

    return (
        <div className="sidebar-frame">
            {
                sidebarItems.map((item, index) => {
                    return <SideBar key={"sidebar-"+index} title={item.title} value={item.value} currentPage={currentPage} action={item.action} />
                })
            }
        </div>
    )
}

export default SideBarFrame;