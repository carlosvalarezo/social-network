const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const passport  = require('passport');

const User = require('../../../models/User');

router.get('/test', (request, response) => response.json({message: 'users success'}));

router.post('/register', (request, response) => {
    const email = request.body.email;
    User.findOne({ email })
        .then(user => {
            if(user) {
                return response.status(400).json({email: 'email already exists'});
            }
            else{
                const name = request.body.name;
                const password = request.body.password;
                const avatar = gravatar.url(email,
                    {s: '200',
                     r: 'pg',
                     d: 'mm'});
                const newUser = new User({
                    name, 
                    email,
                    avatar,
                    password, 
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error) throw err;
                        newUser.password = hash;
                        newUser.save()
                               .then(user => response.json(user))
                               .catch(error => console.log(error));
                    })
                });
            }
        })
        .catch((error) => console.log('error inserting...', error));
});

router.post('/login', (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    //fin de user by email
    User.findOne({email})
        .then(user => {
            //check for user
            if(!user){
                return response.status(400).json({message: 'email not found'});
            }

            //check password
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if(isMatch){
                        // response.json({message: 'success'});
                        // user found
                        // sign token
                        const payload = {id: user.id, name: user.name, avatar: user.avatar}
                        jwt.sign(payload, keys.secret, {expiresIn: 3600},
                            (error, token)=> {
                                response.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });

                        });
                      }
                      else {
                          return response.status(400).json({password: 'password incorrect'});
                      }
                  });
        })
});

router.get('/current', passport.authenticate('jwt', {session:false}), (request, response, next) => {
    response.json({message: 'success'}); 
});

module.exports = router;