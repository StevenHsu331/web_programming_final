import { Router } from "express";
import conn from '../db.js'

const userController = Router();

userController.get("/user/:id", async (req, res) => {
    try{
        const id = req.params.id;
        console.log("get by id: "+ id)
        conn.query(
            `
                SELECT ui.*, d.name AS department_name FROM user_info ui 
                LEFT JOIN department d ON ui.department_id = d.id 
                WHERE ui.id = ?
            `,
            [id],
            (err, result) => {
                if(err){
                    console.log(err);
                    res.send({
                        status: false,
                        message: "failed to get data",
                        user: []
                    })
                }
                else{
                    console.log(result);

                    res.send({
                        status: true,
                        message: "get data successfully.",
                        user: result
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

userController.get("/user", async (req, res) => {
    try{
        conn.query(
            `
                SELECT ui.*, d.name AS department_name FROM user_info ui
                LEFT JOIN department d ON ui.department_id = d.id
                WHERE ui.auth != 0
            `,
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

userController.post("/user", async (req, res) => {
    console.log(req.body);
    const department = req.body.department;
    const auth = req.body.isManager ? 1 : 2;
    const name = req.body.name;
    const pwd = req.body.defaultPwd;
    try{
        var employeeNum;
        conn.query("SELECT employee_num FROM user_info ORDER BY id DESC LIMIT 1", (err, result)=>{
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "failed to insert data"
                })
            }
            else{
                console.log(result[0]);
                if(result.length != 0){
                    employeeNum = "00"+(parseInt(result[0].employee_num.substring(2))+1).toString();
                }
                else{
                    employeeNum = "00101"
                }

                conn.query("BEGIN;", (err, result) => {
                    if(err){
                        console.log(err);
                        res.send({
                            status: false,
                            message: "failed to insert data"
                        })
                    }
                    else{
                        conn.query(
                            "INSERT INTO user_info (department_id, auth, name, password, employee_num, first_login, create_time) VALUES (?,?,?,?,?,1,now())",
                            [department, auth, name, pwd, employeeNum],
                            (err, result) => {
                                console.log(result)
                                if(err){
                                    console.log(err);
                                    conn.query("ROLLBACK;", (err, result) => {
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                
                                    res.send({
                                        status: false,
                                        message: "failed to insert data"
                                    })
                                }
                                else{
                                    conn.query("COMMIT;", (err, result) => {
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
                                    });
                                }
                            }
                        )
                    }
                });
            }
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            status: false,
            message: "connection error"
        });
    }
})

userController.post("/user/change", async (req, res) => {
    const id = req.body.id;
    const encodedPassword = req.body.encodedPassword;

    conn.query("UPDATE user_info SET password = ? WHERE id = ?",
        [encodedPassword, id],
        (err, result) => {
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "password change failed."
                })
            }
            else{
                res.send({
                    status: true,
                    message: "password change successfully."
                })
            }
        }
    )
})

export default userController;