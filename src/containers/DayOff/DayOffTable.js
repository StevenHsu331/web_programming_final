import { useState, useEffect } from "react";
import axios from '../../api'
import DayOffTableRow from './DayOffTableRow'

const DayOffTable = ({dataList, dataTitleList, type}) => {
    useEffect(() =>{
    }, [dataList, dataTitleList])
    return (
        <table className="table bulletin-table">
            <thead>
                <tr>
                    {
                        dataTitleList.map((o, i) =>{
                            return <th key={i}>{o}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
            {
                dataList.map((o, i) => {
                    return <DayOffTableRow type={type} key={i} item={o} idx={i}></DayOffTableRow>
                })
            }
            </tbody>
        </table>
    )
}

export default DayOffTable;