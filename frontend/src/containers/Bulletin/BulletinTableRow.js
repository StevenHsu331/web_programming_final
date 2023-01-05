import { useState, useEffect } from "react";

const BulletinTableRow = ({item, idx}) => {
    return (
        <tr>
            <td>
                <span>{idx}</span>
                </td>
            <td>
                <span>{item.title}</span>
            </td>
            <td>
                <span>{item.content}</span>
            </td>
            <td>
                <span>{item.create_time}</span>
            </td>
        </tr>
    )
}

export default BulletinTableRow