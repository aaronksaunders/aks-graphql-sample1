const humps = require('humps')
const { connectionFromArray } = require('graphql-relay')
const graphQLTools = require('graphql-tools')
const rawData = require('./games.json')

const gamesData = humps // :( pipeline operator plixplox?
  .camelizeKeys(rawData)
  .map((game, id) => Object.assign({}, game, { id }))

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
    last: Int,
    search: String
  ): GameConnection!

  # Unpaginated Games
  allGames: [Game]
}

schema {
  query: Query
}
`

const resolvers = {
  // we should really make id unique across the board here but ¯\_(ツ)_/¯
  Query: {
    game(_, { id }) {
      return gamesData[id]
    },
    allGames () {
      return gamesData
    },
    games (_, args) {
      const filteredList = gamesData.filter(game =>
        game.title.includes(args.search || '')
      )
      return connectionFromArray(filteredList, args)
    }
  }
}

module.exports = graphQLTools.makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  logger: console
})
