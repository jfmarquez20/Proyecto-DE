function setCoordinates() {
    var image = "https://img.icons8.com/color/48/000000/interstate-truck.png";
    var start = {
        lat: 11.02248136,
        lng: -74.86977616
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: start,
        mapTypeId: 'hybrid'
    });

    marker = new google.maps.Marker({
        map: map,
        icon: image
    });
    marker.setPosition(start);

    marker2 = new google.maps.Marker({
        map: map,
        icon: image
    });
    marker2.setPosition(start);

    // Polyline Array
    destinations = [];
    destinations2 = [];

    update = setInterval(function() {
        document.getElementById("coordinates1").innerHTML = latitude;
        document.getElementById("coordinates2").innerHTML = longitude;
        document.getElementById("coordinates3").innerHTML = timeStamp;

        if (truckId == 1) {
            var latitudeFloat = parseFloat(latitude);
            var longitudeFloat = parseFloat(longitude);
            var coordinates = {
                lat: latitudeFloat,
                lng: longitudeFloat
            }

            if (destinations.length < 4) {
            
                destinations.push(coordinates);

                var polylineOptions = {
                    path: destinations,
                    strokeColor: '#00FFFF',
                    geodesic: true,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                };

                var polyline = new google.maps.Polyline(polylineOptions);

            
                polyline.setMap(map);
            } else {
                destinations.push(coordinates);
                if (destinations.length >= 99) {
                
                    destinations.splice(0, destinations.length % 100 + 1);

                }
                runSnapToRoad(destinations);
            
            }   
            //Map options
            var options = {
                center: coordinates
            }

            map.setOptions(options);
            marker.setPosition(coordinates);
        } else if (truckId == 2) {
            var latitudeFloat = parseFloat(latitude);
            var longitudeFloat = parseFloat(longitude);
            var coordinates = {
                lat: latitudeFloat,
                lng: longitudeFloat
            }

            if (destinations2.length < 4) {
            
                destinations2.push(coordinates);

                var polylineOptions2 = {
                    path: destinations2,
                    strokeColor: '#8B0000',
                    geodesic: true,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                };

                var polyline2 = new google.maps.Polyline(polylineOptions2);

            
                polyline2.setMap(map);
            } else {
                destinations2.push(coordinates);
                if (destinations2.length >= 99) {
                
                    destinations2.splice(0, destinations2.length % 100 + 1);

                }
                runSnapToRoad(destinations2);
            
            }
            //Map options
            var options = {
                center: coordinates
            }

            map.setOptions(options);
            marker2.setPosition(coordinates);
        }
    }, 1000);
}