function findByPlace(place) {
    console.log(place)
    socket.emit('byPlace', place);
    socket.on('h_byplace', function(message) {
        console.log("Márquemirey")
        if (message.length == 0) {
            swal({
                title: "NO ENCONTRADO!",
                text: `No hay registro del camión entre las fechas indicadas.
            Ingrese otro rango de fechas.`,
                icon: "info",
            });
        }
        var coord = [];
        for (let i = 0; i < message.length; i++) {
            var x = message[i]
            delete x['Time'];
            x['lat'] = x['Latitude'];
            x['lng'] = x['Longitude'];
            delete x['Latitude'];
            delete x['Longitude'];
            Object.values(x)[0] = parseFloat(Object.values(x)[0]);
            Object.values(x)[1] = parseFloat(Object.values(x)[1]);
            coord.push(x);
            console.log(message)
        };
        console.log(coord)
    });
}