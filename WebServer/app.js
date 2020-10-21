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
require('dotenv').config();

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

    truckId= parseFloat(arrayCoordinates[3]);
    let post = { Latitude: latitude, Longitude: longitude, Time: timeStamp1 };
    
    if (truckId == 1){
        var sql = 'INSERT INTO posts SET ?';
    } else {
        if(truckId == 2){sql = 'INSERT INTO posts1 SET ?';}
    }

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
        socket.emit('historico',coord)
        });
    });

    socket.on('byPlace', msg => {
        console.log(msg)
        Number.prototype.toFixedDown = function(digits) {
            var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)");
            var m = this.toString().match(re);
            return m ? parseFloat(m[1]) : this.valueOf();
        };
        var lat = msg[0];
        var lng = msg[1];

        if (lat < 0 && lng < 0) {
            latSup = (0 - lat.toFixedDown(3)) - 0.001;
            lat1 = lat.toFixedDown(3);
            lat1 = 0 - lat1;
            latInf = lat1 + 0.001;

            lngSup = (0 - lng.toFixedDown(3)) - 0.001;
            lng1 = lng.toFixedDown(3);
            lng1 = 0 - lng1;
            lngInf = lng1 + 0.001;

            var sql = `SELECT * FROM posts WHERE (Latitude BETWEEN '${latSup}' AND '${latInf}') AND (Longitude BETWEEN '${lngSup}' AND '${lngInf}')`;

        } else if (lat < 0 && lng > 0) {
            latSup = (0 - lat.toFixedDown(3)) - 0.001;
            lat1 = lat.toFixedDown(3);
            lat1 = 0 - lat1;
            latInf = lat1 + 0.001;

            lngSup = lng.toFixedDown(3) + 0.001;
            lng1 = lng.toFixedDown(3);
            lngInf = lng1 - 0.001;

            var sql = `SELECT * FROM posts WHERE (Latitude BETWEEN '${latSup}' AND '${latInf}') AND (Longitude BETWEEN '${lngInf}' AND '${lngSup}')`;

        } else if (lat > 0 && lng < 0) {
            latSup = lat.toFixedDown(3) + 0.001;
            lat1 = lat.toFixedDown(3);
            latInf = lat1 - 0.001;  

            lngSup = (0 - lng.toFixedDown(3)) - 0.001;
            lng1 = lng.toFixedDown(3);
            lng1 = 0 - lng1;
            lngInf = lng1 + 0.001;

            var sql = `SELECT * FROM posts WHERE (Latitude BETWEEN '${latInf}' AND '${latSup}') AND (Longitude BETWEEN '${lngSup}' AND '${lngInf}')`;
                    
        } else {
            latSup = lat.toFixedDown(3) + 0.001;
            lat1 = lat.toFixedDown(3);
            latInf = lat1 - 0.001;

            lngSup = lng.toFixedDown(3) - 0.001;
            lng1 = lng.toFixedDown(3);
            lngInf = lng1 - 0.001;

            var sql = `SELECT * FROM posts WHERE (Latitude BETWEEN '${latInf}' AND '${latSup}') AND (Longitude BETWEEN '${lngInf}' AND '${latSup}')`;
        }        

        console.log(sql)
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