const graphQLTools = require('graphql-tools')
const gamesData = require('./games.json')

const typeDefs = `
# Zelda Game
type Game {
  id: ID! # Can't have a db without ids c'mon
  title: String! # The game title
  releaseDate: String # When was the game released (ISO Date)
}

# the schema allows the following query:
type Query {
  # Game Info
  game(id: ID!): Game
}

schema {
  query: Query
}
`;

const resolvers = {
  Query: {
    game(args) {
      console.log(args)
      return Object.assign({}, { id: 3 }, gamesData[3])
    }
  }
}

module.exports = graphQLTools.makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  logger: console
})