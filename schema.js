const humps = require("humps");
const { connectionFromArray } = require("graphql-relay");
const graphQLTools = require("graphql-tools");
const rawData = require("./games.json");

require("es6-promise").polyfill();
require("isomorphic-fetch");

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
    cursor: String!
    node: Game
  }

  type GameConnection {
    edges: [GameEdge!]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Dream {
    id: ID!
    first_name: String!
    last_name: String!
    email : String!
  }


  type DreamEdge {
    cursor: String!
    node: Dream
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


    # Game Info
    dream(id: ID!): Dream

    # Paginated Dreams
    dreams (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): DreamConnection!
  }

  schema {
    query: Query
  }
`;

const resolvers = {
  // we should really make id unique across the board here but ¯\_(ツ)_/¯
  Query: {
    dreams(_, args) {
      return fetch("https://aks-json-db.glitch.me/dreams")
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
    dream(_, { id }) {
      return fetch(`https://aks-json-db.glitch.me/dreams/${id}`)
        .then(res => {
          return res.json();
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
