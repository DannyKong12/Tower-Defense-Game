var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var server = http.Server(app);

app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});

  