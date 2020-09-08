const express = require("express");
const app = express();

app.get('/', function (request, response) {
    response.send('Hecho para la materia de diseño electronico');
});
app.get('/gps', function (request, response) {
    response.send('Aqui va el gps profe');
    response.sendFile(path.join(__dirname, './html_files','index.html'));
});
app.listen(50000, function () {
    console.log("Servidor activado en puerto 50000");
});
