function setCoordinates() {
    var image = "https://img.icons8.com/color/48/000000/interstate-truck.png";
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: {
            lat: 11.02248136,
            lng: -74.86977616
        },
        mapTypeId: 'hybrid'
    });

    markerOnClick = new google.maps.Marker({
        map: map,
    });


    map.addListener("click", (e) => {
        //Clean previous markers
        if (typeof markers !== "undefined") {
            for (var i=0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
            times = [];
        }
        
        var x = [];
        x.push(e.latLng.lat());
        x.push(e.latLng.lng());

        var start = {
            lat: x[0],
            lng: x[1]
        };

        markerOnClick.setPosition(start);
        findByPlace(x);
    })

    var marker = new google.maps.Marker({
        map: map,
        icon: image
    });

    var coordinates = [];
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