const express = require('express');
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '12345',
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Conectado');
});


const app = express();

app.get('/createdb',(req, res) => {
    let sql = 'CREATE DATABASE nodemysql';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Base de datos creada');
    });
});


app.listen('3000', () => {
    console.log('Servidor iniciado en el puerto 3000');
});

