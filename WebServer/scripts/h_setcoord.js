var setop=1;
var coordinates = [];
var coordinates2 = [];
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

    circle = new google.maps.Circle({
        map: map,
        radius: 170,
        fillColor: '#FF6600',
        fillOpacity: 0.3,
        strokeColor: "#FFF",
        strokeWeight: 0
    });

    var marker = new google.maps.Marker({
        map: map,
        icon: image
    });

    var marker2 = new google.maps.Marker({
        map: map,
        icon: image
    });

    
    
        socket.on('historico', function(message) {
            
            if (setop == 1 || setop == 2) {
            color1 = '#00FFFF';    
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
                    runSnapToRoad(b,color1)
                    b = a.splice(a.length - 99);

                }
                runSnapToRoad(b,color1)
            } else {
                runSnapToRoad(coordinates,color1)
            }


            //Map options
            var options = {
                center: coordinates[coordinates.length - 1]
            }

            map.setOptions(options);
            marker.setPosition(coordinates[coordinates.length - 1]);

            }
        });
    

    
        socket.on('historico2', function(message) {
            if (setop == 1 || setop == 3) {
            color2 = '#8B0000';
            coordinates2 = message;
            if (coordinates2.length == 0) {
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

            if (coordinates2.length > 100) {
                a = coordinates2;
                b = a.splice(a.length - a.length % 100);
                while (a.length > 100) {
                    runSnapToRoad(b,color2)
                    b = a.splice(a.length - 99);

                }
                runSnapToRoad(b,color2)
            } else {
                runSnapToRoad(coordinates2,color2)
            }


            //Map options
            var options = {
                center: coordinates2[coordinates2.length - 1]
            }

            map.setOptions(options);
            marker2.setPosition(coordinates2[coordinates2.length - 1]);

        }
        });
}

function setmap1() {
    setop=1;
    //setCoordinates();
}

function setmap2() {
    setop=2;
    //setCoordinates();
}

function setmap3() {
    setop=3;
    //setCoordinates();
}