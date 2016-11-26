import { graphiqlExpress } from 'apollo-server'
import { GRAPHQL_URL } from "config"

export default graphiqlExpress({
  endpointURL: GRAPHQL_URL
});
