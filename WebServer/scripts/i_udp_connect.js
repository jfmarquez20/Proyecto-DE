socket.on('udp message', function(message) {
    var arrayCoordinates = message.split(",");
    latitude = arrayCoordinates[0];
    longitude = arrayCoordinates[1];
    timeStamp = arrayCoordinates[2];
    truckId = parseFloat(arrayCoordinates[3]);
    giro = arrayCoordinates[4];
    
    console.log(message);
});