const { connectionFromArray } = require("graphql-relay");
const graphQLTools = require("graphql-tools");

require("es6-promise").polyfill();
require("isomorphic-fetch");

const typeDefs = `
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
  }

  # company object used in app
  type Company {
    # company object used in app
    id: ID! 
    # company object used in app
    name: String!
    # list of users that are associated with this company
    users(status: String = "any", after: String, first: Int, before: String, last: Int): UserConnection
  }

  type CompanyEdge {
    cursor: String!
    node: Company
  }

  type CompanyConnection {
    edges: [CompanyEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }


  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email : String!
    company: Company
  }

  type UserEdge {
    cursor: String!
    node: User
  }


  type UserConnection {
    edges: [UserEdge]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  # the schema allows the following query:
  type Mutation {
    addUser(first_name:String, last_name :String, email : String) : User
  }

  type Query {
    # Company Info
    company(id: ID!): Company

    companies (
      after: String
      before: String
      first: Int
      last: Int,
      search: String
    ): CompanyConnection!


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


    # Unpaginated Users
    allUsers: [User]

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
      return fetch("https://aks-json-db.glitch.me/users")
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
      return fetch(`https://aks-json-db.glitch.me/users/${id}`).then(res => {
        return res.json();
      });
    },
    allUsers(_, { id }) {
      return fetch(`https://aks-json-db.glitch.me/users`).then(res => {
        return res.json();
      });
    },
    //
    //
    //
    company(_, { id }) {
      console.log("company id", id);
      return fetch(`https://aks-json-db.glitch.me/companies/${id}`)
        .then(res => {
          return res.json();
        })
        .catch(e => {
          console.log(e);
        });
    },
    allCompanies() {
      return fetch("https://aks-json-db.glitch.me/companies").then(res => {
        return res.json();
      });
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
  },
  Company: {
    users(obj, args) {
      return fetch(`https://aks-json-db.glitch.me/users/?companyId=${obj.id}`)
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
  },
  User: {
    company({ companyId }) {
      console.log("company id", companyId);
      return fetch(`https://aks-json-db.glitch.me/companies/${companyId}`)
        .then(res => {
          return res.json();
        })
        .catch(e => {
          console.log(e);
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
