import passport from 'passport';

let LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy(
  function(username, password, done) {
    let err = undefined
    let user = {
      id: username
    }
    done(err, user)
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  let err = undefined
  let user = {
    id: id
  }
  done(err, user)
});
