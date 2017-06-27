const graphQLTools = require('graphql-tools').

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

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: Query
  mutation: Mutation
}
`;

const resolvers = {
  
}

export default graphQLTools.makeExecutableSchema({
  typeDefs,
  resolvers,
})