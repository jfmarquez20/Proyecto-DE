var socket = io.connect('http://localhost:15002');
socket.on('udp message', function(message) {
    var arrayCoordinates = message.split(",");
    latitude = arrayCoordinates[0];
    longitude = arrayCoordinates[1];
    timeStamp = arrayCoordinates[2];
    console.log(message);
});