const humps = require('humps')
const graphQLTools = require('graphql-tools')
const rawData = require('./games.json')

const gamesData = humps.camelizeKeys(rawData)

const typeDefs = `
type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

# Zelda Game
type Game {
  id: ID! # Can't have a db without ids c'mon
  title: String! # The game title
  releaseDate: String # When was the game released (yyyy-mm-dd)
}

type GameEdge {
  cursor: String!
  node: Game
}

type GameConnection {
  edges: [GameEdge!]
  pageInfo: PageInfo!
  totalCount: Int!
}

# the schema allows the following query:
type Query {
  # Game Info
  game(id: ID!): Game

  # Paginated Games
  games (
    after: String
    before: String
    first: Int
    last: Int
  ): GameConnection!
  
  # Unpaginated Games
  allGames: [Game]
}

schema {
  query: Query
}
`;

const resolvers = {
  Query: {
    game(_, { id }) {
      return Object.assign({}, { id }, gamesData[id]) // gimme spread :(
    },
    allGames () {
      return gamesData.map((game, id) => Object.assign({}, game, { id }))
    }
  }
}

module.exports = graphQLTools.makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  logger: console
})