import _ from "lodash"
import pubsub from "./pubsub"

import { resolve as teacher } from "../mongo/teacher"
import { resolve as student } from "../mongo/student"
import { resolve as location } from "../mongo/location"


var count = {
  amount: 1
};

const root = {
  Query: {
    count() {
      return count
    },
    viewer(_, arg, context) {
      return context.user
    },
  },

  Mutation: {
    login(_, {token}, context) {
      let user = {
        id: 'codo',
        username: 'codo',
        password: 'pass'
      }
      context.user = user;
      return new Promise((resolve) => {
        context.req.login(user, () => {
          context.user = context.req.user
          console.log(user);
          resolve(context.req.user)
        })
      })
    },
    loginLocal(_, {username, password}, context) {
      console.log(context.user)
      let user = {
        id: username,
        username,
        password
      }
      console.log(context.req.login);

      return new Promise((resolve) => {
        context.req.login(user, () => {
          context.user = context.req.user
          console.log(user);
          resolve(context.req.user)
        })
      })
    },
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

export default _.merge({}, root, student, teacher, location);
