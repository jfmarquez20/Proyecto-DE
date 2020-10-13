function runSnapToRoad(path) {

    var pathValues = [];
    for (var q = 0; q < path.length; q++) {
        pathVal = path[q];
        pathValues.push(pathVal['lat'].toFixed(6) + ',' + pathVal['lng'].toFixed(6));
    }
    console.log(pathValues)
    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: 'AIzaSyBk2vQCsUBm4JK4oKzAheluXLc4fWgiDTo',
        path: pathValues.join('|')
    }, function(data) {
        processSnapToRoadResponse(data);
        drawSnappedPolyline()
    });
}

function processSnapToRoadResponse(data) {
    console.log(data)
    snappedCoordinates = [];
    placeIdArray = [];
    for (var i = 0; i < data.snappedPoints.length; i++) {
        var latlng = new google.maps.LatLng(
            data.snappedPoints[i].location.latitude,
            data.snappedPoints[i].location.longitude);
        snappedCoordinates.push(latlng);
        placeIdArray.push(data.snappedPoints[i].placeId);
    }
}

function drawSnappedPolyline() {
    let polylines = []
    var snappedPolyline = new google.maps.Polyline({
        path: snappedCoordinates,
        strokeColor: '#00FFFF',
        geodesic: true,
        opacity: 1,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '70px'
        }]
    });

    snappedPolyline.setMap(map);
    polylines.push(snappedPolyline);
}