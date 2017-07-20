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

  type Company {
    id: ID! 
    name: String!
  }

  type CompanyEdge {
    cursor: String!
    node: Company
  }

  type CompanyConnection {
    edges: [CompanyEdge!]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Dream {
    id: ID!
    first_name: String!
    last_name: String!
    email : String!
    company : Company
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
  type Mutation {
    addDream(first_name:String, last_name :String, email : String) : Dream
  }

  type Query {
    # Company Info
    company(id: ID!): Company

    # Paginated Games
    companies (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): CompanyConnection!

    # Unpaginated Company
    allCompanies: [Company]


    # Dream Info
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
    mutation : Mutation
  }
`;

const resolvers = {
  Mutation: {
    addDream(_, args) {
      return fetch("https://aks-json-db.glitch.me/dreams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
      }).then(_result => {
        return _result.json();
      });
    }
  },
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
      return fetch(`https://aks-json-db.glitch.me/dreams/${id}`).then(res => {
        return res.json();
      });
    },
    //
    //
    //
    company(_, { id }) {
      return fetch(
        `https://aks-json-db.glitch.me/companies/${id}`
      ).then(res => {
        return res.json();
      });
    },
    allCompanies() {
      // return gamesData;
    },
    companies(_, args) {
      return fetch("https://aks-json-db.glitch.me/companies")
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
    }
  }
};

module.exports = graphQLTools.makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  logger: console
});
