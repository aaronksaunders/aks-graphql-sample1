const humps = require("humps");
const { connectionFromArray } = require("graphql-relay");
const graphQLTools = require("graphql-tools");
const rawData = require("./games.json");

const gamesData = humps // :( pipeline operator plixplox?
  .camelizeKeys(rawData)
  .map((game, id) => Object.assign({}, game, { id })); // gimme spread :(

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
    id: ID! 
    node: Game
  }

  type GameConnection {
    edges: [GameEdge!]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Dream {
    cursor: String!
    node: Game
  }


  type DreamEdge {
    cursor: String!
    node: Game
  }


  type DreamConnection {
    edges: [DreamEdge!]
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

    # Paginated Dreams
    games (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): GameConnection!
  }

  schema {
    query: Query
  }
`;

const resolvers = {
  // we should really make id unique across the board here but ¯\_(ツ)_/¯
  Query: {
    allDreams(_, args) {
      return fetch('https://aks-json-db.glitch.me/dreams')
        .then(res => {
          return res.json();
        })
        .then(j => {
          return Object.assign(
            {},
            { totalCount: j.length },
            connectionFromArray(j, args)
          );
        });
    },
    game(_, { id }) {
      return gamesData[id];
    },
    allGames() {
      return gamesData;
    },
    games(_, args) {
      const filteredList = gamesData.filter(game =>
        game.title.includes(args.search || "")
      );
      return Object.assign(
        {},
        { totalCount: filteredList.length },
        connectionFromArray(filteredList, args)
      );
    }
  }
};

module.exports = graphQLTools.makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  logger: console
});
