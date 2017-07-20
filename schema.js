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
users : [Company]
  }

  type CompanyEdge {
    cursor: String!
    node: Company
  }

  type CompanyConnection {
    edge: CompanyEdge!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type CompaniesConnection {
    edges: [CompanyEdge!]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email : String!
    company : CompanyConnection
  }


  type UserEdge {
    cursor: String!
    node: User
  }


  type UserConnection {
    edges: [UserEdge!]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  # the schema allows the following query:
  type Mutation {
    addUser(first_name:String, last_name :String, email : String) : User
  }

  type Query {
    # Company Info
    Company(id: ID!): Company

    companies (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): CompaniesConnection!

    # Paginated Games
    companies (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): CompaniesConnection!

    # Unpaginated Company
    allCompanies: [Company]


    # User Info
    user(id: ID!): User

    # Paginated User
    users (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): UserConnection!
  }

  schema {
    query: Query
    mutation : Mutation
  }
`;

const resolvers = {
  Mutation: {
    addUser(_, args) {
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
    users(_, args) {
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
    user(_, { id }) {
      return fetch(`https://aks-json-db.glitch.me/dreams/${id}`).then(res => {
        return res.json();
      });
    },
    //
    //
    //
    Company(_, { id }) {
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
