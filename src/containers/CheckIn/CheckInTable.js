import { useState, useEffect } from "react";
import axios from '../../api';
import CheckInTableRow from "./CheckInTableRow";

const CheckInTable = ({checkInDS}) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>time</th>
                    <th>type</th>
                </tr>
            </thead>
            <tbody>
            {
                checkInDS.map((o, i) => {
                    return <CheckInTableRow key={i} detail={o} idx={i}></CheckInTableRow>
                })
            }
            </tbody>
        </table>
    )
}

export default CheckInTable;