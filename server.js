const express = require('express')
const graphqlHTTP = require('express-graphql')
const graphqlSchema = require('./schema')
const app = express()

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Serve info page
app.use('/', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true
}))
