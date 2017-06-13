var express = require('express');
var app = express();

var pageSize = 2;

// Load database
var gamesData = require('./.data/games.json');
var gamesArray = [];
//split games list into pages
var gamesTemp = gamesData.slice();
while (gamesTemp.length > 0) {
    gamesArray.push(gamesTemp.splice(0, pageSize));
}
var games = {
  count: gamesData.length,
  paginated: gamesArray
};

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

app.get("/games/:gameId", function(request, response) {
  response.send(returnDetail(gamesData, request));
});

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function returnDetail(data, request) {
  var param = request.params[request.route.path.split(':')[1]];
  var item = clone(data[parseInt(param)]);
  item.url = currentURL(request);
  return item;
}

function returnPaginated(data, request) {
  //set current page if specifed as get variable (eg: /?page=2)
  var currentPage = 1;
  if (typeof request.query.page !== 'undefined') {
      currentPage = parseInt(request.query.page);
  }
  return {
    count: data.count,
    next: currentPage === data.paginated.length ? null : currentURL(request) + '?page=' + (currentPage + 1),
    previous: currentPage === 1 ? null : currentURL(request) + '?page=' + (currentPage - 1),
    results: data.paginated[currentPage - 1]
  };
}

function currentURL(request) {
  return request.protocol + '://' + request.get('host') + request.url.split('?')[0];
}