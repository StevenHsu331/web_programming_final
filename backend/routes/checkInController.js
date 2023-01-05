import { query, Router } from "express";
import conn from '../db.js'

const checkInController = Router();

checkInController.get("/checkIn/search/:id", async (req, res) => {
    const id =req.params.id;

    conn.query("SELECT * FROM check_in WHERE user_id = ? ORDER BY check_time",
        [id], (err, result) =>{
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "failed to get data",
                    result: []
                })
            }
            else{
                console.log(result)
                res.send({
                    status: true,
                    message: "access succeed",
                    result: result
                })
            }
        }
    )
})

checkInController.get("/checkIn/search", async (req, res) => {
    const keyword =req.query.keyword;
    console.log(keyword)

    conn.query(`
            SELECT ci.* FROM check_in ci
            LEFT JOIN user_info ui ON ci.user_id = ui.id
            WHERE ui.name = ? OR ui.employee_num = ?
            ORDER BY check_time
        `,
        [keyword, keyword], (err, result) =>{
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "failed to get data",
                    result: []
                })
            }
            else{
                console.log(result)
                res.send({
                    status: true,
                    message: "access succeed",
                    result: result
                })
            }
        }
    )
})

checkInController.post("/checkIn/:id", async (req, res) => {
    const id =req.params.id;
    
    conn.query("INSERT INTO check_in (user_id, check_time, type) VALUES (?,now(),0)", [id], (err, result) => {
        if(err){
            console.log(err);
            res.send({
                status: false,
                message: "check in failed"
            })
        }
        else{
            res.send({
                status: true,
                message: "check in success"
            })
        }
    })
})

checkInController.post("/checkOut/:id", async (req, res) => {
    const id =req.params.id;

    conn.query("INSERT INTO check_in (user_id, check_time, type) VALUES (?,now(),1)", [id], (err, result) => {
        if(err){
            console.log(err);
            res.send({
                status: false,
                message: "check out failed"
            })
        }
        else{
            res.send({
                status: true,
                message: "check out success"
            })
        }
    })
})

export default checkInController;