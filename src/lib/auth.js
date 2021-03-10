const {api_key} = require('../keys');

module.exports = {
  isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/signin');
  },
  isNotLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/profile');
  },
  api_auth(req, res, next) {
    if(req.headers.id == api_key) {
      return next();
    }
    return res.json({Status: 'Authentication failed!'});
  }
}
