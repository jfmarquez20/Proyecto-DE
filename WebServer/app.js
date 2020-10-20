var fs = require('fs');
var dgram = require('dgram');
var socketio = require('socket.io');
var express = require('express');
const mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = socketio.listen(server);
var socket = dgram.createSocket('udp4');
require('dotenv').config({ path: '.env.txt' });

//Render CSS
app.use(express.static(__dirname));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB
});

db.connect((err) => {
    if (err) {
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

    let post = { Latitude: latitude, Longitude: longitude, Time: timeStamp1 };
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) { throw err; }
        console.log(result);
    });
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/historico', (request, response) => {
    response.sendFile(path.join(__dirname + '/historico.html'));
});

io.on('connection', socket => {

    socket.on('formInputs', msg => {
        var init = msg[0];
        var fin = msg[1];

        let sql = `SELECT * FROM posts WHERE Time BETWEEN '${init}' and '${fin}'`;
        let query = db.query(sql, (err, result) => {
            if (err) { throw err; }
            console.log(result.length);

            var coord = [];
            for (let i = 0; i < result.length; i++) {
                var x = result[i]
                delete x['Time'];
                x['lat'] = x['Latitude'];
                x['lng'] = x['Longitude'];
                delete x['Latitude'];
                delete x['Longitude'];
                Object.values(x)[0] = parseFloat(Object.values(x)[0]);
                Object.values(x)[1] = parseFloat(Object.values(x)[1]);
                coord.push(x);
            }
            socket.emit('historico', coord)
        });
    });

    socket.on('byPlace', msg => {
        var lat = msg.lat;
        var lng = msg.lng;
        lat1 = fix(lat * 10 ^ 3) / 10 ^ 3;
        lng1 = fix(lng * 10 ^ 3) / 10 ^ 3;
        let sql = `SELECT * FROM posts WHERE Latitude BETWEEN'${lat1-0.001}' and '${lat1}' and Longitude '${lng1-0.01}' and '${lng1}'`;
        let query = db.query(sql, (err, result) => {
            if (err) { throw err; }
            console.log(result.length);
            socket.emit('h_byplace', result)
        });
    });
});

socket.bind(50000);
server.listen(15002, () => {
    console.log("Servidor abierto en puerto 15002");
});