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

        if (typeof markers == "undefined") {
            markers = [];
            times = [];
        }

        infoWindow = new google.maps.InfoWindow();
        
        for (let i = 0; i < message.length; i++) {
            var x = message[i]
            var v = x['Time'].toString();
            var vectort = v.split(/T|Z/)
            var pos2 = vectort[1].match(/.{1,2}/g)
            // var hour = parseInt(pos2[0]) - 5;
            // pos2[0] = hour < 10 ? "0" + hour.toString():hour.toString();
            pos2.splice(-2,2)
            var vectort2 = pos2.join("")
            vectort[1] = vectort2;  
            var time = vectort[0] + "\xa0\xa0" + vectort[1];

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
            times.push(time); 

            marker1.addListener("mouseover", () => {
                infoWindow.setContent(times[i])
                infoWindow.open(map,markers[i]);
            });
            
        };

    });
}