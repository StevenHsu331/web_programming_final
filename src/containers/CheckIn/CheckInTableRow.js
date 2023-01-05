import { useState, useEffect } from "react";

const CheckInTableRow = ({detail, idx}) => {
    return (
        <tr>
            <td>
                <span>{idx}</span>
                </td>
            <td>
                <span>{detail.check_time}</span>
            </td>
            <td>
                <span>{detail.type == 0 ? "check in" : "check out"}</span>
            </td>
        </tr>
    )
}

export default CheckInTableRow