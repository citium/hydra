import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://api-service:password@localhost/apollo');

//#region Hot Module Reload
if (module.hot) {
  module.hot.dispose(() => {
    //clean up the models to prevent mongoose from complaining
    mongoose.connection.models = {};
  })
}
//#endregion
