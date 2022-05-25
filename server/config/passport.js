
const JwtStrategy = require("passport-jwt").Strategy;
const fs = require("fs");
const path = require("path");
const db = require('../db/DBRepository');

// public key
const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: (req) => {
    // grab token from cookies
    var token = null;
    if(req && req.cookies) token = req.cookies['flights-jwt'];
    return token;
  },
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

module.exports = (passport) => {
  passport.use('jwt',
    new JwtStrategy(options, function (jwt_payload, done) {
      // JWT valid
      try {
        // Get user by id (sub is set to id in JWT)
        const user = db.getUserById(jwt_payload.sub);
        if(user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch(e) {
        return done(e, false);
      }
    }),
  );
};