var mysql = require('mysql');

// Connection configuration
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'noderestapidb'
});

var now = new Date();
var timestamp = parseInt(now.getTime() / 1000);
var queryString = mysql.format("Insert into `KPI` values (?,?,?,?,?,?)", [4, 10, "22", timestamp, "vzwca", "xxx"]);
conn.query(queryString);

now = new Date();
timestamp = parseInt(now.getTime() / 1000);
var queryString = mysql.format("Insert into `KPI` values (?,?,?,?,?,?)", [5, 11, "24", timestamp, "vzwca", "xxx"]);
conn.query(queryString);

console.log("Done.");