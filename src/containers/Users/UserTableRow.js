import { useState, useEffect } from "react";

const UserTableRow = ({detail, idx}) => {
    return (
        <tr>
            <td>
                <span>{idx}</span>
                </td>
            <td>
                <span>{detail.name}</span>
            </td>
            <td>
                <span>{detail.employee_num}</span>
            </td>
            <td>
                <span>{detail.department_name}</span>
            </td>
            <td>
                <span>{detail.auth == 1 ? "yes" : "no"}</span>
            </td>
        </tr>
    )
}

export default UserTableRow