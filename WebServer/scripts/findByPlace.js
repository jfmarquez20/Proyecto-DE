function findByPlace(place) {
    //console.log(place)
    socket.emit('byPlace', place);

    info = [];

    socket.on('h_byplace', function(message) {
        if (message.length == 0) {
            swal({
                title: "NO ENCONTRADO!",
                text: `No hay registro del camión cerca del punto seleccionado.`,
                icon: "info",
            });
        }

        console.log(message);
        
        deleteInfo();

        
        function deleteInfo() {
            for (let i = 0; i < info.length; i++) {
                info[i].close();
            }
            info = [];
        }
        

        for (let i = 0; i < message.length; i++) {
            var x = message[i]

            var pos = {
                lat: x['Latitude'],
                lng: x['Longitude']
            };

            var time = x['Time'].toString();

            const infoWindow = new google.maps.InfoWindow({
                content: time,
                position: pos
            });

            infoWindow.open(map);

            // var marker1 = new google.maps.Marker({
            //     map: map,
            // });
            info.push(infoWindow);

            // markers[markers.length - 1].setPosition(pos)
            // markers[markers.length - 1].addListener("click", () => {
            //     infowindow.open(map, markers[markers.length - 1]);
            // });
        };
        //console.log(coord)
    });
}