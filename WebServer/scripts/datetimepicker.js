function timeRange() {
    var x = 10; //minutes interval
    var times = []; // time array
    var tt = 0; // start time

    for (var i = 0; tt < 24 * 60; i++) {
        var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        var mm = (tt % 60); // getting minutes of the hour in 0-55 format
        times[i] = ("0" + (hh)).slice(-2) + ':' + ("0" + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
        tt = tt + x;
    }
    return times;
}


const form = document.getElementById('form')

form.addEventListener('submit', (e) =>{
    e.preventDefault();

    initValue = e.target.elements.datetimeinit.value;
    finValue = e.target.elements.datetimefin.value;

    var inputValues = [];
    inputValues.push(initValue);
    inputValues.push(finValue);

    if (initValue == "" && finValue == "") {
        swal({
            title: "ERROR!",
            text: "Debes ingresar la fecha inicial y final de busqueda.",
            icon: "warning",
        });
        return false;
    } else if (initValue == "") {
        swal({
            title: "ERROR!",
            text: "Debes ingresar la fecha inicial de busqueda",
            icon: "warning",
        });
        return false;
    } else {
        socket.emit('formInputs', inputValues);
        setCoordinates();

        map.addListener("click", (e) => {
            //Clean previous markers
            if (typeof markers !== "undefined") {
                for (var i=0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                times = [];
            }
            
            var x = [];
            x.push(e.latLng.lat());
            x.push(e.latLng.lng());
            x.push(initValue);
            x.push(finValue);
    
            var start = {
                lat: x[0],
                lng: x[1]
            };
            
            console.log(x);
            markerOnClick.setPosition(start);
            circle.setCenter(start);
            findByPlace(x);
        })

    }
});

$("#datetimeinit").datetimepicker({
    format: 'Y-m-d H:i',
    onShow: function(ct) {
        this.setOptions({
            //maxDate:$('#datetimefin').val()?$('#datetimefin').val():false
        })
    },
    allowTimes: timeRange()
});

$("#datetimefin").datetimepicker({
    format: 'Y-m-d H:i',
    onShow: function(ct) {
        this.setOptions({
            minDateTime: $('#datetimeinit').val() ? $('#datetimeinit').val() : false
        })
    },
    allowTimes: timeRange()
});