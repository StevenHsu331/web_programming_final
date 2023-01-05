import { useState, useEffect } from "react";
import axios from '../../api'
import BulletinTableRow from './BulletinTableRow'

const BulletinTable = ({id, formOpen}) => {
    const [bulletins, setBulletins] = useState([]);

    useEffect(() => {
        const fetchData = async () =>{
            let bulletins = await getBulletins();
            setBulletins(bulletins);
        }

        fetchData();
    }, [formOpen])

    const getBulletins = async () => {
        const {
            data: { status, message, bulletins },
        } = await axios.get(`/bulletin/${id}`);
        
        return await bulletins;
    }

    return (
        <table className="table bulletin-table">
            <thead>
                <tr>
                    <th></th>
                    <th>title</th>
                    <th>detail</th>
                    <th>publish date time</th>
                </tr>
            </thead>
            <tbody>
            {
                bulletins.map((o, i) => {
                    return <BulletinTableRow key={i} item={o} idx={i}></BulletinTableRow>
                })
            }
            </tbody>
        </table>
    )
}

export default BulletinTable;