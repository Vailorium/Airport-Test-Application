const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const app = express();
const port = 8000;
const path = require('path');

const bodyParser = require('body-parser');

/* import routes */
const auth = require('./routes/auth');
const flights = require('./routes/flights');
const bookings = require('./routes/bookings');

// parse provided cookies
app.use(cookieParser());

// set up cors
app.use(cors({credentials: true, origin: [process.env.CLIENT_URL]}));

// set up JSON body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up jwt passport
require('./config/passport')(passport);

// init passport
app.use(passport.initialize());

//! might not need this
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

// API routes
app.use('/auth/', auth);
app.use('/flight/', flights);
app.use('/booking/', bookings);

app.use(express.static(path.join(__dirname, "../client", "build")));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});