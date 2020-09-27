var fs = require('fs');
var dgram = require('dgram');
var socketio = require('socket.io');
var express = require('express');
const mysql = require('mysql');
var path = require('path');

var app = express();
var server = require('http').Server(app);       
var io = socketio.listen(server);
var socket = dgram.createSocket('udp4');
require('dotenv').config();

//Render CSS
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DB
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Conectado');
});

socket.on('message', (content, rinfo) => { 
    console.log(`Server got: ${content} from ${rinfo.address}:${rinfo.port}`);
    io.sockets.emit('udp message', content.toString());

    var msg = content.toString();
    var arrayCoordinates = msg.split(",");
    latitude = arrayCoordinates[0];
    longitude = arrayCoordinates[1];
    timeStamp1 = arrayCoordinates[2];
    
    let post = {Latitude:latitude, Longitude:longitude,Time:timeStamp1};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err){ throw err;}
        console.log(result);
    });
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/index.html'));
  });


socket.bind(50000);
server.listen(15002, () => {
    console.log("Servidor abierto en puerto 15002");
});
