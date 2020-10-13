function setCoordinates() {
    var socket = io.connect('http://localhost:15002');
    var image = "https://img.icons8.com/color/48/000000/interstate-truck.png";
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: {
            lat: 11.02248136,
            lng: -74.86977616
        },
        mapTypeId: 'hybrid'
    });
    var marker = new google.maps.Marker({
        map: map,
        icon: image
    });

    coordinates = [];
    socket.on('historico', function(message) {
        coordinates = message;
        if (coordinates.length == 0) {
            swal({
                title: "NO ENCONTRADO!",
                text: `No hay registro del camión entre las fechas indicadas.
            Ingrese otro rango de fechas.`,
                icon: "info",
            });
        }

        lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

        if (coordinates.length > 100) {
            a = coordinates;
            b = a.splice(a.length - a.length % 100);
            while (a.length > 100) {
                runSnapToRoad(b)
                b = a.splice(a.length - 99);

            }
            runSnapToRoad(b)
        } else {
            runSnapToRoad(coordinates)
        }


        //Map options
        var options = {
            center: coordinates[coordinates.length - 1]
        }

        map.setOptions(options);
        marker.setPosition(coordinates[coordinates.length - 1]);

    });

}