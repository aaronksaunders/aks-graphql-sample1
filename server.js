var express = require('express');
var app = express();

var pageSize = 2;

// Load database
var games = require('./.data/games.json');
var gamesArray = [];
//split games list into pages
var gamesTemp = games.slice(0);
while (gamesTemp.length > 0) {
    gamesArray.push(gamesTemp.splice(0, pageSize));
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Serve info page
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Start API endpoints
app.get("/games", function (request, response) {
  response.send(returnPaginated(games, request));
});

function returnPaginated(data, request) {
  //set current page if specifed as get variable (eg: /?page=2)
  var currentPage = 1;
  if (typeof request.query.page !== 'undefined') {
      currentPage = +request.query.page;
  }
  //show list of students from group
  var gamesList = gamesArray[currentPage - 1];
  return {
    count: games.length,
    next: currentPage === gamesList.length ? null : currentURL(request) + '?page=' + (currentPage + 1),
    previous: currentPage === 1 ? null : currentURL(request) + '?page=' + (currentPage - 1),
    results: gamesList
  };
}

app.get("/games/:gameId", function(request, response) {
  var payload = games[request.params.gameId];
  payload.url = currentURL(request);
  response.send(games[request.params.gameId]);
});

function currentURL(request) {
  return request.protocol + '://' + request.get('host') + request.route.path;
}