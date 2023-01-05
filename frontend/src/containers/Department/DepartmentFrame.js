import { useState, useRef, useCallback, useEffect} from 'react';
import Header from '../Header'
import NewDepartmentForm from './NewDepartmentForm'
import axios from '../../api'
import '../../tree.css'

const DepartmentFrame = ({setCoverShowed}) => {
    const [formOpen, setFormOpen] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [dataList, setDataList] = useState([]);

    useEffect( ()=>{
        const fetchData = async () =>{
            let departments = await getDepartments();
            setDataSource(departments[0]);
            setDataList(departments[1]);
        }
        fetchData();
    },[formOpen])

    const getDepartments = async () =>{
        const {
            data: { status, message, departmentObject, departmentList },
        } = await axios.get('/department');
        
        return await [departmentObject, departmentList];
    }

    const renderAllNode = (data) =>{
        return(
            <li key={data.id}>
                <span>{data.name}</span>
                {
                    data.child.length > 0 ?
                    <ul key={(data.id+"child")}>
                        {
                            data.child.map((item, index) => {
                                return renderAllNode(item);
                            })
                        }
                    </ul>
                    : null
                }
            </li>
        )
    }

    const changeWindowStatus = () => {
        setFormOpen(!formOpen);
        setCoverShowed(!formOpen);
    }

    return (
        <div className='inner-frame'>
            <Header title={"組織圖"} type={"inner"}></Header>
            <div className='function-bar'>
                <button className='btn btn-success' onClick={() => {changeWindowStatus()}}>新增部門/組織</button>
            </div>
            <NewDepartmentForm dataList={dataList} formOpen={formOpen} changeWindowStatus={changeWindowStatus}></NewDepartmentForm>
            <div className='tree-frame'>
                <ul className='tree'>
                {
                    dataSource.map((item)=>{
                        return renderAllNode(item)
                    })
                }
                </ul>
            </div>
        </div>
    )
}

export default DepartmentFrame;