var express = require('express');
var app = express();

var pageSize = 2;

// Load databases
var games = require('./.data/games.json');
var gamesArray = [];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Serve info page
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

 //split list into groups
for (var gamesIndex = 0; gamesIndex < games.length; gamesIndex++) {
  gamesArray.push(games[gamesIndex]);
}

// Start API endpoints
app.get("/games", function (request, response) {
  //set current page if specifed as get variable (eg: /?page=2)
  var currentPage = 1;
  if (typeof request.query.page !== 'undefined') {
      currentPage = +request.query.page;
  }
  //show list of students from group
  var gamesList = gamesArray[+currentPage - 1];
  response.send({
    count: games.length,
    results: gamesList,
    previous: currentPage === 1 ? null : currentPage < gamesArray.length ? request.protocol + '://' + request.get('host') + request.originalUrl + '?page=' + (currentPage + 1)
    url: 
  });
});

app.get("/games/:gameId", function(request, response) {
  var payload = games[request.params.gameId];
  payload.url = currentURL(request);
  response.send(games[request.params.gameId]);
});
  
function currentURL(request) {
  return request.protocol + '://' + request.get('host') + request.originalUrl;
}

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
/*app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});*/

