import { Router } from "express";
import conn from '../db.js'

const dayOffController = Router();

dayOffController.get("/dayOff", (req, res) => {
    const id = req.query.id;
    const auth = req.query.auth;

    conn.query(`
        SELECT do.*, ui.name AS applicant FROM day_off do
        LEFT JOIN user_info ui ON do.apply_id = ui.id
        WHERE do.apply_id = ?
    `,
    [id], (err, result) => {
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
            if(auth != 2){
                let selfData = result;

                conn.query(`
                    SELECT do.*, ui.name AS applicant FROM (day_off do, user_info uis)
                    LEFT JOIN user_info ui ON do.apply_id = ui.id
                    WHERE uis.id = ? AND uis.department_id = do.apply_department_id AND do.status = 0
                `,
                [id], (err, result) => {
                    if(err){
                        console.log(err);
                        res.send({
                            status: false,
                            message: "failed to get data",
                            result: []
                        })
                    }
                    else{
                        res.send({
                            status: true,
                            message: "fetch data successfully",
                            result: {
                                self: selfData,
                                review: result
                            }
                        })
                    }
                })
            }
            else{
                res.send({
                    status: true,
                    message: "fetch data successfully",
                    result: {
                        self: result,
                        review: []
                    }
                })
            }
        }
    })
})

dayOffController.post("/dayOff/request", (req, res) => {
    const id = req.body.id;
    const content = req.body.content;
    const startDate = req.body.beginStr;
    const endDate = req.body.endStr;

    conn.query("SELECT department_id FROM user_info WHERE id = ?",
        [id],
        (err, result) => {
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "failed to add data"
                })
            }
            else{
                console.log(id)
                const departmentId = result[0].department_id;
                conn.query("INSERT INTO day_off (apply_id, apply_department_id, content, start_date, end_date, status, apply_time) VALUES (?,?,?,?,?,0,now())",
                    [id, departmentId, content, startDate, endDate],
                    (err, result) => {
                        if(err){
                            console.log(err);
                            res.send({
                                status: false,
                                message: "failed to add data"
                            })
                        }
                        else{
                            res.send({
                                status: true,
                                message: "form submit successfully"
                            })
                        }
                    }
                )
            }
        }
    )
})

dayOffController.post("/dayOff/response/:id", (req, res) => {
    const id = req.params.id;

    conn.query("UPDATE day_off SET status = 1 WHERE id = ?",
        [id],
        (err, result) => {
            if(err){
                console.log(err);
                res.send({
                    status: false,
                    message: "failed to add data"
                })
            }
            else{
                res.send({
                    status: true,
                    message: "request complete successfully"
                })
            }
        }
    )
})

export default dayOffController;