import mongo_express from 'mongo-express/lib/middleware'
import mongoConfig from "../mongoConfig"

export default mongo_express(mongoConfig)
