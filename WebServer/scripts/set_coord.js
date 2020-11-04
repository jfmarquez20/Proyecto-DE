var start1 = {
    lat: 11.02248136,
    lng: -74.86977616
};
var setop=1;
destinations = [];
destinations2 = [];

function setCoordinates() {
    var image = "https://img.icons8.com/color/48/000000/interstate-truck.png";
    var start = {
        lat: 10.959409,
        lng: -74.804982
    };
    var startalt = {
        lat: 53.779846,
        lng: 125.875376
    };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: start,
        mapTypeId: 'hybrid'
    });

    marker = new google.maps.Marker({
        map: map,
        icon: image
    });
    marker.setPosition(startalt);

    marker2 = new google.maps.Marker({
        map: map,
        icon: image
    });
    marker2.setPosition(startalt);

    if (setop==1){
        color1 = '#00FFFF';
        color2 = '#8B0000';
        var polylineOptions = {
            path: destinations,
            strokeColor: color1,
            geodesic: true,
            strokeOpacity: 1.0,
            strokeWeight: 2
        };
        var polylineOptions2 = {
            path: destinations2,
            strokeColor: color2,
            geodesic: true,
            strokeOpacity: 1.0,
            strokeWeight: 2
        };

        var polyline = new google.maps.Polyline(polylineOptions);
        polyline.setMap(map);
        var polyline2 = new google.maps.Polyline(polylineOptions2);
        polyline2.setMap(map);
    }

    if (setop==2){
        color = '#00FFFF';
        var polylineOptions = {
            path: destinations,
            strokeColor: color,
            geodesic: true,
            strokeOpacity: 1.0,
            strokeWeight: 2
        };

        var polyline = new google.maps.Polyline(polylineOptions);
        polyline.setMap(map);
    }

    if (setop==3){
        color = '#8B0000';
        var polylineOptions2 = {
            path: destinations2,
            strokeColor: color,
            geodesic: true,
            strokeOpacity: 1.0,
            strokeWeight: 2
        };

        var polyline2 = new google.maps.Polyline(polylineOptions2);
        polyline2.setMap(map);
    }

    update = setInterval(function() {
        

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

            var options = {
                center: coordinates
            }

            if (setop==1){
                document.getElementById("coordinates1").innerHTML = latitude;
                document.getElementById("coordinates2").innerHTML = longitude;
                document.getElementById("coordinates3").innerHTML = timeStamp;
                document.getElementById("coordinates4").innerHTML = giro;
                polyline.setMap(map);
                marker.setPosition(coordinates);
            }

            if (setop==2){
                document.getElementById("coordinates1").innerHTML = latitude;
                document.getElementById("coordinates2").innerHTML = longitude;
                document.getElementById("coordinates3").innerHTML = timeStamp;
                document.getElementById("coordinates4").innerHTML = giro;
                polyline.setMap(map);
                map.setOptions(options);
                marker.setPosition(coordinates);
                marker2.setPosition(null);
            }

            
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

            var options2 = {
                center: coordinates2
            }

            if (setop==1){
                document.getElementById("coordinates1").innerHTML = latitude;
                document.getElementById("coordinates2").innerHTML = longitude;
                document.getElementById("coordinates3").innerHTML = timeStamp;
                document.getElementById("coordinates4").innerHTML = giro;
                polyline2.setMap(map);
                marker2.setPosition(coordinates2);
            }

            if (setop==3){
                document.getElementById("coordinates1").innerHTML = latitude;
                document.getElementById("coordinates2").innerHTML = longitude;
                document.getElementById("coordinates3").innerHTML = timeStamp;
                document.getElementById("coordinates4").innerHTML = giro;
                polyline2.setMap(map);
                map.setOptions(options2);
                marker.setPosition(null);
                marker2.setPosition(coordinates2);
            }
        }
    }, 1000);
}

function setmap1() {
    setop=1;
    setCoordinates();
    document.getElementById("coordinates1").innerHTML = "---";
    document.getElementById("coordinates2").innerHTML = "---";
    document.getElementById("coordinates3").innerHTML = "---";
    document.getElementById("coordinates4").innerHTML = "---";
}

function setmap2() {
    setop=2;
    setCoordinates();
    document.getElementById("coordinates1").innerHTML = "---";
    document.getElementById("coordinates2").innerHTML = "---";
    document.getElementById("coordinates3").innerHTML = "---";
    document.getElementById("coordinates4").innerHTML = "---";
}

function setmap3() {
    setop=3;
    setCoordinates();
    document.getElementById("coordinates1").innerHTML = "---";
    document.getElementById("coordinates2").innerHTML = "---";
    document.getElementById("coordinates3").innerHTML = "---";
    document.getElementById("coordinates4").innerHTML = "---";
}