import { Router } from "express";
import dotenv from 'dotenv-defaults';
import sha256 from 'sha256'
import conn from '../db.js'
import {setCookie, getCookie} from '../cookie.js'

dotenv.config();
const loginController = Router();

loginController.get("/login", async(req, res) => {
    if(getCookie("isLogin")){
        res.send({
            result: {
                isLogin: getCookie("isLogin"),
                employeeNum: getCookie("employeeNum"),
                employeeName: getCookie("employeeName"),
                auth: getCookie("auth"),
                id: getCookie("id")
            }
        })
    }
    else{
        res.send({
            result: {
                isLogin: false,
                employeeNum: "",
                employeeName: "",
                auth: 2,
                id: ""
            }
        })
    }
})

loginController.get("/logout", async(req, res) => {
    setCookie("isLogin", false);
    setCookie("id", "");
    setCookie("auth", "");
    setCookie("employeeNum", "");
    setCookie("employeeName", "");
    res.send({
        status: true,
        message: "logout successfully"
    })
})

loginController.post("/login", async (req, res) => {
    console.log(req.body);
    const employeeNum = req.body.employeeNum;
    const password = req.body.encodedPassword;
    console.log(process.env.ADMIN_NUMBER);
    console.log(process.env.ADMIN_PWD)
    if(employeeNum == process.env.ADMIN_NUMBER && password == sha256(process.env.ADMIN_PWD)){
        res.send({
            status: true,
            message: "login successfully.",
            userInfo: {
                id: 0,
                auth: 0,
                employeeNum: employeeNum,
                employeeName: "admin"
            }
        })
    }
    else{
        try{
            conn.query(
                "SELECT * FROM user_info WHERE employee_num = ? AND password = ?",
                [employeeNum, password],
                (err, result) => {
                    if(err){
                        console.log(err);
                        res.send({
                            status: false,
                            message: "failed to get data"
                        })
                    }
                    else{
                        console.log(result);
                        if(result.length == 0){
                            res.send({
                                status: false,
                                message: "account not exist."
                            })
                        }
                        else{
                            setCookie("isLogin", true);
                            setCookie("id", result[0].id);
                            setCookie("auth", result[0].auth);
                            setCookie("employeeNum", result[0].employee_num);
                            setCookie("employeeName", result[0].name);
                            res.send({
                                status: true,
                                message: "login successfully.",
                                userInfo: {
                                    id: result[0].id,
                                    auth: result[0].auth,
                                    employeeNum: result[0].employee_num,
                                    employeeName: result[0].name
                                }
                            })
                        }
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
    }
})

export default loginController;