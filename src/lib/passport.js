const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if(rows.length > 0) {
    const user = rows[0];
    const valid_password = await helpers.matchPassword(password, user.password);
    if(valid_password) {
      done(null, user, req.flash('success', 'Welcome '+user.username))
    } else {
      done(null, false, req.flash('message', 'Incorrect password'));
    }
  } else {
    return done(null, false, req.flash('message', 'The username does not exists'))
  }
}));

passport.use('local.apiSignin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log('yeah');
  const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if(rows.length > 0) {
    const user = rows[0];
    const valid_password = await helpers.matchPassword(password, user.password);
    if(valid_password) {
      console.log('yeah');
      done(null, user)
    } else {
      done(null, false);
    }
  } else {
    return done(null, false);
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const {fullname} = req.body;
  const newUser = {
    username,
    password,
    fullname
  };
  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO users set ?', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.use('local.apiSignup', new LocalStrategy({
  passReqToCallback: true
}, async (req, done) => {
  const {username, password, fullname} = req.body;
  const newUser = {
    username,
    password,
    fullname
  };
  newUser.password = await helpers.encryptPassword(password);
  const result = await pool.query('INSERT INTO users set ?', [newUser]);
  newUser.id = result.insertId;
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return done(null, rows[0]);
});
