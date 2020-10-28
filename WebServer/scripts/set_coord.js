var start1 = {
    lat: 11.02248136,
    lng: -74.86977616
};
var setop=1;

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
            color = '#00FFFF';
            var latitudeFloat = parseFloat(latitude);
            var longitudeFloat = parseFloat(longitude);
            var coordinates = {
                lat: latitudeFloat,
                lng: longitudeFloat
            }            
                destinations.push(coordinates);

                var polylineOptions = {
                    path: destinations,
                    strokeColor: color,
                    geodesic: true,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                };

                var polyline = new google.maps.Polyline(polylineOptions);

            
                polyline.setMap(map);
  
            //Map options
            var options = {
                center: coordinates
            }

            if (setop==2){
                map.setOptions(options);
            }
            
            marker.setPosition(coordinates);
        } else if (truckId == 2) {
            color = '#8B0000';
            var latitudeFloat2 = parseFloat(latitude);
            var longitudeFloat2 = parseFloat(longitude);
            var coordinates2 = {
                lat: latitudeFloat2,
                lng: longitudeFloat2
            }
            
                destinations2.push(coordinates2);

                var polylineOptions2 = {
                    path: destinations2,
                    strokeColor: color,
                    geodesic: true,
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                };

                var polyline2 = new google.maps.Polyline(polylineOptions2);

            
                polyline2.setMap(map);
                
            //Map options
            var options2 = {
                center: coordinates2
            }

            if (setop==3){
                map.setOptions(options2);
            }
            

            marker2.setPosition(coordinates2);
        }
    }, 1000);
}

function setmap1() {
    setop=1;
}

function setmap2() {
    setop=2;
}

function setmap3() {
    setop=3;
}