function findByPlace(place) {
    socket.emit('byPlace', place);

    socket.on('h_byplace', function(message) {
        if (message.length == 0) {
            swal({
                title: "NO ENCONTRADO!",
                text: `No hay registro del camión cerca del punto seleccionado.`,
                icon: "info",
            });
        }
        console.log(message);

        if (typeof markers == "undefined") {
            markers = [];
        }

        for (let i = 0; i < message.length; i++) {
            var x = message[i]
            var v = x['Time'].toString();
            var vectort = v.split("")
            vectort[10] = " ";
            vectort[23] = " ";
            var time = vectort.join("");

            var pos = {
                lat: x['Latitude'],
                lng: x['Longitude']
            };
            
            var image1 = "https://img.icons8.com/ultraviolet/40/000000/map-pin.png";
            var marker1 = new google.maps.Marker({
                map: map,
                icon: image1,
                animation: google.maps.Animation.DROP,
                position: pos
            });

            markers.push(marker1);


            const infoWindow = new google.maps.InfoWindow({
                content: time
            }); 

            marker1.addListener("click", () => {
                infoWindow.open(map,markers[i]);
            });
            
        };
        //console.log(coord)
    });
}