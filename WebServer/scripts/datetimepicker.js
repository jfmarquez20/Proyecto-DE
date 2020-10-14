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

const form = document.getElementById('form')

form.addEventListener('submit', (e) =>{
    e.preventDefault();

    initValue = e.target.elements.datetimeinit.value;
    finValue = e.target.elements.datetimefin.value;

    var x = document.getElementById("datetimeinit").value;
    var y = document.getElementById("datetimefin").value;

    if (initValue == "") {
        swal({
            title: "ERROR!",
            text: "Debes ingresar la fecha inicial de busqueda",
            icon: "warning",
        });
        return false;
    } else if (finValue == "") {
        swal({
            title: "ERROR!",
            text: "Debes ingresar la fecha final de busqueda",
            icon: "warning",
        });
        return false;
    } else {
        var inputValues = [];
        inputValues.push(initValue);
        inputValues.push(finValue);
        socket.emit('formInputs',inputValues);
        setCoordinates();
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