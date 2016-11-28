import { graphqlHook, Schema } from "./connect"

const schema = new Schema({
  name: String,
})

const name = "student"
const modelName = name[0].toUpperCase() + name.substr(1)
const model = graphqlHook(schema, modelName)
const resolve = {
  Query: {
    [name]: () => ({
      findById({id}) {
        return model.findById(id).lean()
      },
      list() {
        return model.find().lean()
      }
    }),
  },
  Mutation: {
    [name]: () => ({
      create({name}) {
        let item = new model({
          name
        })
        return item.save().then((item) => {
          return item.toObject()
        }, () => {
          console.log(`Failed to create ${modelName} with ${name}`)
        })
      },
      update({id, name}) {
        return model.findById(id).then((item) => {
          item.name = name
          return item.save().then(item => {
            return item
          })
        }, () => {
          console.log(`Cant find record ${modelName}`)
        })
      }
    }),
  },
}

export { model, resolve }
