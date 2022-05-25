const express = require('express');
const passport = require('passport');
const router = express.Router();
const crypto = require('crypto');

const { issueJWT } = require('../lib/utils');

const { getUserProfile } = require('../user');
const db = require('../db/DBRepository');

router.post('/login', async (req, res, next) => {
  var user = req.body;
  const { username, password } = user;
  try{
    const result = await db.getUserByUsername(username);
    if(!result) {
      return res.status(401).json({ message: 'Incorrect username or password.' });
    }

    crypto.pbkdf2(password, result.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if(err) {
        console.error(err);
        return res.status(500).send();
      }
      if(!crypto.timingSafeEqual(result.password, hashedPassword)) {
        return res.status(401).json({ message: 'Incorrect username or password.' });
      }
      const token = issueJWT(result);
      return res.status(200).cookie('flights-jwt', token, { maxAge: (1000 * 60 * 60 * 24), httpOnly: true, }).json({ message: "success", token: token, user: getUserProfile(result)});
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
});

router.post('/register', async function(req, res, next) {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
    if(err) { return next(err); }
    try{
      const result = await db.register(req.body.displayName, req.body.username, hashedPassword, salt);

      req.login(result, function(err) {
        if(err) {
          return next(err);
        }
        return res.status(200).json({ message: "success", user: getUserProfile(result)});
      });
    } catch(e) {
      return next(e);
    }
  });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const user = await req.user;
  // console.log(user);
  // // if(!req.user) {
  //   // return res.status(401).send();
  return res.status(200).json({ user: getUserProfile(user)});
  // } else {
  //   return res.status(200).json(req.user);
  // }
});

module.exports = router;