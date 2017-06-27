const express = require('express')
const app = express()
// Load database
const gamesData = require('./games.json')


// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Serve info page
app.get('/', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}))
