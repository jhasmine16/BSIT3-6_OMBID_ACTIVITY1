const mysql = require('mysql');

const conn = mysql.createConnection({
    host : "localhost",
    user : "root",
    password :"",
    database : "ombid"
    
});

module.exports = conn;