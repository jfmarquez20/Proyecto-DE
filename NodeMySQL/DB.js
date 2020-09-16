const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'servercoordinates'
});


let sql = 'CREATE TABLE posts(Latitude REAL(15),Longitude REAL(15),Time VARCHAR(20))';
connection.query(sql, (err, result) => {
if (err) throw err;
console.log(result);
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Conectado');
});

let post = {Latitude:'1', Longitude:'1',Time: '3:15'};
let sql = 'INSERT INTO posts SET ?';
let query = db.query(sql, post, (err, result) => {
    if(err) throw err;
    console.log(result);


const app = express();


app.listen('3000', () => {
    console.log('Servidor iniciado en el puerto 3000');
});

