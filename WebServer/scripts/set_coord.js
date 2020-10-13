function setCoordinates() {
    var image = "https://img.icons8.com/color/48/000000/interstate-truck.png";
    var start = {
        lat: 11.02248136,
        lng: -74.86977616
    };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: start,
        mapTypeId: 'hybrid'
    });

    var marker = new google.maps.Marker({
        map: map,
        icon: image
    });
    marker.setPosition(start);

    // Polyline Array
    var destinations = [];

    update = setInterval(function() {
        document.getElementById("coordinates1").innerHTML = latitude;
        document.getElementById("coordinates2").innerHTML = longitude;
        document.getElementById("coordinates3").innerHTML = timeStamp;

        var latitudeFloat = parseFloat(latitude);
        var longitudeFloat = parseFloat(longitude);
        var coordinates = {
            lat: latitudeFloat,
            lng: longitudeFloat
        }

        runSnapToRoad(coordinates);


        var polylineOptions = {
            path: destinations,
            strokeColor: '#00FFFF',
            geodesic: true,
            strokeOpacity: 1.0,
            strokeWeight: 2
        };

        var polyline = new google.maps.Polyline(polylineOptions);

        //Map options
        var options = {
            center: coordinates
        }

        map.setOptions(options);
        marker.setPosition(coordinates);
        polyline.setMap(map);
    }, 1000);
}