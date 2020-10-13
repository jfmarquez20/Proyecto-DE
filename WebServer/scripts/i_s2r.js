function runSnapToRoad(path) {

    var pathValues = [];
    for (var q = 0; q < path.length; q++) {
        pathVal = path[q];
        pathValues.push(pathVal['lat'].toFixed(6) + ',' + pathVal['lng'].toFixed(6));
    }
    console.log(pathValues)
    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: 'AIzaSyB4p7hFeP1wuuHwFJFTDyyMtNkgyU6g5Vo',
        path: pathValues.join('|')
    }, function(data) {
        processSnapToRoadResponse(data);
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
        destinations.push(latlng);
        placeIdArray.push(data.snappedPoints[i].placeId);
    }
}