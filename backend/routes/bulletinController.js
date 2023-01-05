import { query, Router } from "express";
import conn from '../db.js'

const bulletinController = Router();

bulletinController.get("/bulletin/:id", async (req, res) => {
    const targetId = req.params.id;
    try{
        conn.query(
            `
                SELECT b.* FROM bulletin b
                LEFT JOIN bulletin_target_map btm ON b.id = btm.bulletin_id
                WHERE btm.target_id = ?
            `,
            [targetId],
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
                    res.send({
                        status: true,
                        message: "get data successfully.",
                        bulletins: result,
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

bulletinController.post("/bulletin", async (req, res) => {
    console.log(req.body);
    const title = req.body.title;
    const content = req.body.content;
    const targets = req.body.targets
    try{
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
                    "INSERT INTO bulletin (title, content, create_time) VALUES (?,?,now())",
                    [title, content],
                    (err, result) => {
                        console.log(result)
                        if(err){
                            console.log(err);
                            conn.query("ROLLBACK;", (err, result) => {
                                if(err){
                                    console.log(err);
                                    res.send({
                                        status: false,
                                        message: "failed to insert data"
                                    })
                                }
                            })
                            res.send({
                                status: false,
                                message: "failed to insert data"
                            })
                        }
                        else{
                            conn.query("SELECT id FROM bulletin ORDER BY id DESC LIMIT 1", (err, result) =>{
                                if(err){
                                    console.log(err);
                                    conn.query("ROLLBACK;", (err, result) => {
                                        if(err){
                                            console.log(err);
                                            res.send({
                                                status: false,
                                                message: "failed to insert data"
                                            })
                                        }
                                    })
                                    res.send({
                                        status: false,
                                        message: "failed to insert data"
                                    })
                                }
                                else{
                                    const lastId = result[0].id;
                                    console.log("lastID: " + lastId)
                                    var targetQuery = "INSERT INTO bulletin_target_map (bulletin_id, target_id) VALUES "
                                    var targetParams = [];
                                    targets.forEach((o, i) => {
                                        targetQuery += `(?, ?),`;
                                        targetParams.push(lastId);
                                        targetParams.push(o.id);
                                    })
                                    targetQuery = targetQuery.substring(0, targetQuery.length-1);
        
                                    conn.query(targetQuery, targetParams, (err, result) =>{
                                        if(err){
                                            console.log(err);
                                            conn.query("ROLLBACK;", (err, result) => {
                                                if(err){
                                                    console.log(err);
                                                    res.send({
                                                        status: false,
                                                        message: "failed to insert data"
                                                    })
                                                }
                                            })
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
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                )
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

export default bulletinController;