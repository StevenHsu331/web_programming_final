import mysql from 'mysql'
import dotenv from "dotenv-defaults";

dotenv.config();

const mysqlInfo = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
}

const conn = mysql.createPool(mysqlInfo);

const initializeDB = () => {
    conn.query(`
        CREATE TABLE IF NOT EXISTS user_info(
            id INT AUTO_INCREMENT,
            department_id INT,
            name varchar(64),
            employee_num varchar(8),
            password varchar(256),
            auth INT,
            first_login tinyint,
            create_time datetime,
            PRIMARY KEY (id)
        );
    `, (err, result) => {
        console.log("user_info table create successfully.");
    })

    conn.query(`
        CREATE TABLE IF NOT EXISTS department(
            id INT AUTO_INCREMENT,
            parent_id INT,
            name VARCHAR(128),
            create_time datetime,
            PRIMARY KEY (id)
        );
    `, (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("department table create successfully.");
        }
    })

    conn.query(`
        CREATE TABLE IF NOT EXISTS bulletin(
            id INT AUTO_INCREMENT,
            title varchar(128),
            content varchar(1024),
            create_time datetime,
            PRIMARY KEY (id)
        );
    `,(err, result) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("bulletin table create successfully.");
        }
    })

    conn.query(`
        CREATE TABLE IF NOT EXISTS bulletin_target_map(
            bulletin_id INT,
            target_id INT
        )
    `,(err, result) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("bulletin map table create successfully.");
        }
    })

    conn.query(`
        CREATE TABLE IF NOT EXISTS day_off(
            id INT AUTO_INCREMENT,
            apply_id INT,
            apply_department_id INT,
            content VARCHAR(256),
            start_date date,
            end_date date,
            apply_time datetime,
            status tinyint,
            PRIMARY KEY (id)
        )
    `,(err, result) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("day off table create successfully.");
        }
    })

    conn.query(`
        CREATE TABLE IF NOT EXISTS check_in(
            id INT AUTO_INCREMENT,
            user_id INT,
            check_time datetime,
            type tinyint,
            PRIMARY KEY (id)
        )
    `,(err, result) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("check in table create successfully.");
        }
    })
}

initializeDB();

export default conn;