import mongoose, { Schema } from 'mongoose';
import pluralize from 'pluralize'
import pubsub from "../graphql/pubsub"

mongoose.connection.models = {};
mongoose.connection.close(() => {
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/apollo');
})


function graphqlHook(schema, modelName) {
  function secondStamp() {
    return Math.round(+new Date() / 1000);
  }

  schema.add({
    updateAt: Number,
    createAt: Number,
  })

  schema.pre('save', function(next) {
    if (this.createAt === undefined) {
      this.createAt = secondStamp()
    }
    this.updateAt = secondStamp()

    console.log(`please invalidate cache ${modelName} ${this._id}`)
    pubsub.publish('invalidate', {
      type: modelName,
      id: this._id
    });
    next()
  })

  schema.set('toObject', {
    virtuals: true
  })
  schema.set('toJSON', {
    virtuals: true
  })


  schema.virtual('type').get(() => "Student");
  schema.virtual('id').get(function() {
    return modelName + this._id
  });

  let model = mongoose.model(pluralize(modelName), schema)

  module._update = module.update
  module.update = (...args) => {
    console.warn("this query will not trigger save", args);
    return module._update(...args)
  }

  return model
}
export { mongoose, graphqlHook, Schema }
