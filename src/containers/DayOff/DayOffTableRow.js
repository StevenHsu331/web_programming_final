import { useState, useEffect } from "react";
import axios from '../../api'

const DayOffTableRow = ({item, idx, type}) => {
    const pass = async () =>{
        const {
            data: {status, message}
        } = await axios.post(`/dayOff/response/${item.id}`);

        alert(message)
    }

    return (
        <tr>
            <td>
                <span>{idx}</span>
                </td>
            <td>
                <span>{item.applicant}</span>
            </td>
            <td>
                <span>{item.apply_time}</span>
            </td>
            <td>
                <span>
                    {
                        type === "self" ? 
                        (item.status ? "pass" : "reviewing"):
                        <button type="button" className="btn btn-success" onClick={pass}>通過</button>
                    }
                </span>
            </td>
        </tr>
    )
}

export default DayOffTableRow