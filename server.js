var express = require('express');
var app = express();

// Load databases
var games = require('./.data/games.json');

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Serve info page
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Simple in-memory store for now

// Start API endpoints
app.get("/games", function (request, response) {
  response.send(games);
});

app.get("/games/:gameId", function(request, response) {
  response.send(games[request.params.gameId]);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
/*app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});*/

