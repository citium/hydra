import { makeExecutableSchema, addErrorLoggingToSchema } from 'graphql-tools'

import schema from './schema.gql'

import resolvers from "./resolve"

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});

addErrorLoggingToSchema(executableSchema, {
  log: (e) => console.error(e)
});

export default executableSchema;
