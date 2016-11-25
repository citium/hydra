import { SubscriptionManager } from 'graphql-subscriptions'
import schema from './schema'
import pubsub from "./pubsub"

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: { },
});

export default subscriptionManager
