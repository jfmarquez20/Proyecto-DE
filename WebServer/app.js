var fs = require('fs');
var dgram = require('dgram');
var socketio = require('socket.io');
var express = require('express');

var app = express();
var server = require('http').Server(app);       
var io = socketio.listen(server);
var socket = dgram.createSocket('udp4');

socket.on('message', (content, rinfo) => { 
    console.log(`Server got: ${content} from ${rinfo.address}:${rinfo.port}`);
    io.sockets.emit('udp message', content.toString());
});

app.get('/', (request, response) => {
    response.writeHead(200, {'content-type': 'text/html'});
    var file = fs.createReadStream('index.html');
    file.pipe(response);
  });

socket.bind(50000);
server.listen(15002, () => {
    console.log("Servidor abierto en puerto 15002");
});