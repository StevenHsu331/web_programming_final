import React from "react";
import { useState, useEffect} from 'react';

const SideBar = ({title, value, currentPage, action}) => {
    const [isSelected, setIsSelected] = useState(value == currentPage);
    const changeBarStatus = () => {
        action();
    }

    useEffect(()=>{
        setIsSelected(value == currentPage);
    }, [currentPage])

    return (
        <div className={isSelected ? "sidebar-item-selected" : "sidebar-item"} onClick={changeBarStatus}>
            <span>{title}</span>
        </div>
    )
}

export default SideBar;