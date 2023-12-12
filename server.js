const express = require('express');
var mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const { handle } = require('express/lib/application');
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME,
    timezone: 'UTC'
});

app.post("/dolgozat", (req, res) => {
    let body = req.body;
    pool.query(`INSERT INTO dolgozatok VALUES (null, '${body.nev}', '${body.dolgozat}', '${body.leiras}', '${body.datum}', '${body.konzulensnev}', ${body.ertekeles})`, (err, results) => {
        handleError(err);
        sendResults(req, res, results, results.affectedRows, "dolgozatok", "record(s) inserted into");
    });
});

app.get("/dolgozat", (req, res) => {
    pool.query(`SELECT * FROM dolgozatok`, (err , results) => {
        handleError(err);
        sendResults(req, res, results, results.length, "dolgozatok", "record(s) sent from");
    });
});

app.get("/dolgozat/:id", (req, res) => {
    pool.query(`SELECT * FROM dolgozatok WHERE ID = ${req.params.id}`, (err , results) => {
        handleError(err);
        sendResults(req, res, results, results.length, "dolgozatok", "record(s) sent from");
    });
});

app.patch("/dolgozat/:id", (req, res) => {
    let body = req.body;
    pool.query(`UPDATE dolgozatok SET nev = '${body.nev}', zarodolgozatcim = '${body.dolgozat}', rovidleiras = '${body.leiras}', leadasidatum = '${body.datum}', konzulensnev = '${body.konzulensnev}', ertekeles = ${body.ertekeles} WHERE ID = ${req.params.id}`, (err , results) => {
        handleError(err);
        sendResults(req, res, results, results.affectedRows, "dolgozatok", "record(s) updated in");
    });
});

app.delete("/dolgozat/:id", (req, res) => {
    pool.query(`DELETE FROM dolgozatok WHERE ID = ${req.params.id}`, (err , results) => {
        handleError(err);
        sendResults(req, res, results, results.affectedRows, "dolgozatok", "record(s) deleted from");
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

function sendResults(req, res, results, affectedRows, table, message){
    console.log(`${req.socket.remoteAddress}: ${affectedRows} ${message} ${table}.`);
    res.send(results);
}

function handleError(err){
    if (err) {
        console.log(err.sqlMessage)
    }
}