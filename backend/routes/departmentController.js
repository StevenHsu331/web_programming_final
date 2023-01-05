import { query, Router } from "express";
import conn from '../db.js'

const departmentController = Router();

departmentController.get("/department", async (req, res) => {
    try{
        conn.query(
            "SELECT * FROM department ORDER BY parent_id",
            (err, result) => {
                if(err){
                    console.log(err);
                    res.send({
                        status: false,
                        message: "failed to get data",
                        result: []
                    })
                }
                else{
                    console.log(result);
                    let departments = [];
                    let parentChildMap = {};

                    const loopAllDepth = (depth) =>{
                        depth.forEach((o) => {
                            o["child"] = o.id in parentChildMap ? parentChildMap[o.id] : [];
                            if(o.child.length != 0) loopAllDepth(o.child);
                        })
                    }

                    result.forEach((o) =>{
                        let department = {
                            id: o.id,
                            name: o.name
                        }
                        if (o.parent_id == -1){
                            departments.push(department);
                        }
                        else{
                            if(o.parent_id in parentChildMap){
                                parentChildMap[o.parent_id].push(department);
                            }
                            else{
                                parentChildMap[o.parent_id] = [department];
                            }
                        }
                    });

                    loopAllDepth(departments);
                    console.log(departments)

                    res.send({
                        status: true,
                        message: "get data successfully.",
                        departmentObject: departments,
                        departmentList: result,
                    })
                }
            }
        )
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            status: false,
            message: "connection error"
        });
    }
})

departmentController.get("/department/users/:departmentId", async (req, res) => {
    const departmentId = req.params.departmentId;
    console.log("get by department id: "+ departmentId)
    try{
        conn.query(
            `
                SELECT ui.*, d.name AS department_name FROM user_info ui
                LEFT JOIN department d ON ui.department_id = d.id
                WHERE ui.department_id = ?
            `,
            [departmentId],
            (err, result) => {
                if(err){
                    console.log(err);
                    res.send({
                        status: false,
                        message: "failed to get data",
                        users: []
                    })
                }
                else{
                    console.log(result);

                    res.send({
                        status: true,
                        message: "get data successfully.",
                        users: result
                    })
                }
            }
        )
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            status: false,
            message: "connection error",
        });
    }
})

departmentController.get("/department/users", async (req, res) =>{
    conn.query(
        "SELECT * FROM department ORDER BY parent_id",
        (err, result) => {
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "failed to get data",
                    result: []
                })
            }
            else{
                let departments = [];
                let parentChildMap = {};

                const loopAllDepth = (depth) =>{
                    depth.forEach((o) => {
                        o["child"] = o.id in parentChildMap ? parentChildMap[o.id] : [];
                        if(o.child.length != 0) loopAllDepth(o.child);
                    })
                }

                result.forEach((o) =>{
                    let department = {
                        id: o.id,
                        name: o.name
                    }
                    if (o.parent_id == -1){
                        departments.push(department);
                    }
                    else{
                        if(o.parent_id in parentChildMap){
                            parentChildMap[o.parent_id].push(department);
                        }
                        else{
                            parentChildMap[o.parent_id] = [department];
                        }
                    }
                });

                loopAllDepth(departments);

                let userDepartmentMap = {};
                conn.query(`
                        SELECT id, department_id, name, employee_num FROM user_info ORDER BY auth DESC
                    `,(err, result) => {
                        if(err){
                            console.log(err);
                            res.send({
                                status: false,
                                message: "failed to get data",
                                result: []
                            })
                        }
                        else{
                            const loopAllDepartment = (department) =>{
                                department.forEach((o) => {
                                    o["member"] = o.id in userDepartmentMap ? userDepartmentMap[o.id] : [];
                                    if(o.child.length) loopAllDepartment(o.child);
                                })
                            }

                            result.forEach((o) => {
                                let user = {
                                    id: o.id,
                                    name: o.name,
                                    employeeNum: o.employee_num
                                }

                                if(o.department_id in userDepartmentMap){
                                    userDepartmentMap[o.department_id].push(user);
                                }
                                else{
                                    userDepartmentMap[o.department_id] = [user];
                                }
                            })
                            
                            loopAllDepartment(departments);
                            res.send({
                                status: true,
                                message: "get data successfully.",
                                users: departments,
                            })
                        }
                    }
                )
            }
        }
    )
})

departmentController.post("/department", async (req, res) => {
    console.log(req.body);
    const parent = req.body.parent == "" ? "-1" : req.body.parent;
    const name = req.body.name;
    try{
        var checkStatus = true;

        conn.query(
            "SELECT * FROM department WHERE parent_id = ? AND name = ?",
            [parent, name],
            (err, result) => {
                if(err){
                    console.log(err);
                    checkStatus = false;
                    res.send({
                        status: false,
                        message: "failed to get data"
                    })
                }
                else{
                    console.log(result);
                    if(result.length != 0){
                        checkStatus = false;
                        res.send({
                            status: false,
                            message: "duplicate department."
                        })
                    }
                }
            }
        )
        
        if(checkStatus){
            conn.query(
                "INSERT INTO department (parent_id, name, create_time) VALUES (?,?,now())",
                [parent, name],
                (err, result) => {
                    console.log(result)
                    if(err){
                        console.log(err);
                        res.send({
                            status: false,
                            message: "failed to insert data"
                        })
                    }
                    else{
                        res.send({
                            status: true,
                            message: "successfully add."
                        })
                    }
                }
            )
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            status: false,
            message: "connection error"
        });
    }
})

export default departmentController;