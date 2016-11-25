import pubsub from "./pubsub"

var count = {
  amount: 1
};

const root = {
  Query: {
    count() {
      return count
    }
  },

  Mutation: {
    addCount(_, {amount}) {
      count.amount += amount
      pubsub.publish('countUpdated', count);
      return count
    }
  },

  Subscription: {
    countUpdated(amount) {
      return amount;
    }
  }
};

export default root
