
function runSnapToPoint(path) {

    var pathValues;

    pathVal = path;
    pathValues=(pathVal['lat'].toFixed(6) + ',' + pathVal['lng'].toFixed(6));

    
    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: 'AIzaSyC9t2ZsrarU4KQl7fZl6Yr2vkS3dckb_KY',
        path: pathValues
    }, function(data) {
        processSnapToPointResponse(data);
    });
}

function runSnapToRoad(path) {

    var pathValues = [];
    for (var q = 0; q < path.length; q++) {
        pathVal = path[q];
        pathValues.push(pathVal['lat'].toFixed(6) + ',' + pathVal['lng'].toFixed(6));
    }
    
    $.get('https://roads.googleapis.com/v1/snapToRoads', {
        interpolate: true,
        key: 'AIAIzaSyC9t2ZsrarU4KQl7fZl6Yr2vkS3dckb_KY',
        path: pathValues.join('|')
    }, function(data) {
        processSnapToRoadResponse(data);
        drawSnappedPolyline();
    });
}

function processSnapToPointResponse(data) {
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
    lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
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
    for (i in polylines) {
        polylines[i].setMap(null);
    }
    snappedPolyline.setMap(map);
    polylines.push(snappedPolyline);
}