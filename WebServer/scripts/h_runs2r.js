function runSnapToRoad(path,color) {
    var pathValues = [];
    for (var q = 0; q < path.length; q++) {
        pathVal = path[q];
        pathValues.push(pathVal['lat'].toFixed(6) + ',' + pathVal['lng'].toFixed(6));
    }
    console.log(pathValues)
    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: 'AIzaSyC9t2ZsrarU4KQl7fZl6Yr2vkS3dckb_KY',
        path: pathValues.join('|')
    }, function(data) {
        processSnapToRoadResponse(data);
        drawSnappedPolyline(color)
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

function drawSnappedPolyline(color) {
    let polylines = []
    var snappedPolyline = new google.maps.Polyline({
        path: snappedCoordinates,
        strokeColor: color,
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