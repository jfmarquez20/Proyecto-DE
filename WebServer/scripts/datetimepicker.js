function timeRange() {
    var x = 5; //minutes interval
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

function empty() {
    var x = document.getElementById("datetimeinit").value;
    var y = document.getElementById("datetimefin").value;
    if (x == "") {
        swal({
            title: "ERROR!",
            text: "Debes ingresar la fecha inicial de busqueda",
            icon: "warning",
        });
        return false;
    } else if (y == "") {
        swal({
            title: "ERROR!",
            text: "Debes ingresar la fecha final de busqueda",
            icon: "warning",
        });
        return false;
    } else {
        setCoordinates();
    }

    // document.getElementById("datetimeinit").value = ""
    // document.getElementById("datetimefin").value = ""
}

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