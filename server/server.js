const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const app = express();
const port = 8080;

var LocalStrategy = require('passport-local').Strategy;

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const crypto = require('crypto');

const db = require('./db/DBRepository');

const auth = require('./routes/auth');
const bodyParser = require('body-parser');

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({credentials: true, origin: ['http://localhost:3000']}));

app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./config/passport')(passport);

app.use(passport.initialize());
// app.use(passport.session());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

// passport.use('local', new LocalStrategy(async function verify(username, password, done) {
//   try{
//     const result = await db.getUserByUsername(username);
//     if(!result) {
//       return done(null, false, { message: 'Incorrect username or password.' });
//     }

//     crypto.pbkdf2(password, result.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//       if(err) { return done(err); }
//       if(!crypto.timingSafeEqual(result.password, hashedPassword)) {
//         return done(null, false, { message: 'Incorrect username or password.' });
//       }
//       return done(null, result);
//     });
//   } catch (err) {
//     return done(err);
//   }
// }));

// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     console.log('s', user);
//     cb(null, user.display_name);
//   });
// });

// passport.deserializeUser(function(user, cb) {
//   console.log('test');
//   process.nextTick(function() {
//     console.log('ds', user);
//     cb(null, user.displayName);
//   });
// });

app.use('/', auth);
// http://www.gcmap.com/map?P=YSSY+-NZNE&MS=wls&MR=120&MX=720x360&PM=*


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});