import { apolloExpress } from 'apollo-server'
import 'isomorphic-fetch'

import schema from '../graphql/schema'

export default apolloExpress(() => ({
  schema,
  context: { }
}))
