const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load User model
const User = require('../../models/User')


//route: GET api/users/test
//description: Tests users route
//access: Public
router.get('/test', (req, res) => res.json({msg: 'goodbye world'}))

//route: GET api/users/register
//description: Register user
//access: Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        return res.status(400).json({email: 'Email already exists'})
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', //Size
          r: 'pg', //Rating
          d: 'mm' // Default

        })
        console.log('Your record has been successfully created')

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) {throw err};
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(console.log(err))
          })
        })
      }
    })

})

//route: post api/users/login
//description: Login User / REturning JWT Token
//access: Private
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find User email
  User.findOne({ email })
    .then(user => {

      //Check for user
      if(!user){
        return res.status(404).json({email: 'User not found'});
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then( isMatch => {
          if(isMatch){
            //User Matched
            const payload = {id: user.id, name: user.name, avatar: user.avatar} //Create JWT Payload
            //Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })
              });

          } else {
            return res.status(400).json({password: "Password Incorrect"})
          }
        })
    });
})

//route: GET api/users/current
//description: Return Current User
//access: Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email

  })
})

// router.post('/experiment', (req, res) => {
//   const name = req.body.name;
//
//   User.findOne({name})
//     .then( coolName => {
//       if(coolName){
//         res.json({custom: `My name is ${name}`})
//       } else {
//         return res.status(400).json({failure: 'My name didnt work'})
//       }
//     })
// })


module.exports = router;
