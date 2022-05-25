const express = require('express');
const passport = require('passport');
const router = express.Router();
const crypto = require('crypto');

const { getUserProfile, issueJWT } = require('../lib/utils');

const db = require('../db/DBRepository');

router.post('/login', async (req, res, next) => {
  // grab form data
  var user = req.body;
  const { username, password } = user;
  
  try{
    // grab user by username (username is unique)
    const result = await db.getUserByUsername(username);

    // if no user was returned, username is incorrect
    if(!result) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    // hash + salt password using salt retrieved from db
    crypto.pbkdf2(password, result.salt, 310000, 32, 'sha256', function(err, hashedPassword) {

      // server error (crypto function failed)
      if(err) {
        console.error(err);
        return res.status(500).send();
      }

      // if hashes aren't equal, password is incorrect
      if(!crypto.timingSafeEqual(result.password, hashedPassword)) {
        return res.status(401).json({ message: 'Incorrect username or password.' });
      }

      // all data is correct, create access token
      const token = issueJWT(result);

      // send token as cookie, send user profile as raw
      return res
        .status(200)
        .cookie('flights-jwt', token, { maxAge: (1000 * 60 * 60 * 24), httpOnly: true, })
        .json({ message: "success", user: getUserProfile(result)});
    });
  } catch (err) {
    // most likely db failure
    console.error(err);
    return res.status(500).send();
  }
});

router.post('/register', async function(req, res, next) {
  // create user salt and salt submitted password
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    // server error (crypto function failed)
    if(err) {
      console.error(err);
      return res.status(500).send();
    }

    try{
      const result = await db.register(req.body.displayName, req.body.username, hashedPassword, salt);

      // all data is correct, create access token
      const token = issueJWT(result);

      // send token as cookie, send user profile as raw
      return res
        .status(200)
        .cookie('flights-jwt', token, { maxAge: (1000 * 60 * 60 * 24), httpOnly: true, })
        .json({ message: "success", user: getUserProfile(result)});
    } catch(e) {
      // database error
      console.error(err);
      return res.status(500).send();
    }
  });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  // gets user profile after verifying provided jwt
  const user = await req.user;
  return res.status(200).json({ user: getUserProfile(user)});
});

module.exports = router;