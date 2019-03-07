const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

router.get('/test', (request, response) => response.json({ ok: 'true' }));

router.post('/register', (request, response) => {
    const { errors, isValid } = validateRegisterInput(request.body);
    console.log({errors, isValid})

    if (!isValid) {
        return response.status(400).json(errors);
    }

    const email = request.body.email;
    User.findOne({ email })
        .then(user => {
            if (user) {
                errors.email = 'email already exists';
                return response.status(400).json(errors);
            }
            else{
                const name = request.body.name;
                const password = request.body.password;
                const avatar = gravatar.url(email,
                    {
                        s: '200',
                        r: 'pg',
                        d: 'mm'
                    });
                const newUser = new User({
                    name,
                    email,
                    avatar,
                    password,
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) { return response.status(400).json({ error }) }
                        newUser.password = hash;
                        newUser.save()
                            .then(user => response.status(200).json({ message: 'users registered succesfully' }))
                            .catch(error => console.log(error));
                    })
                });
            }
        })
        .catch((error) => console.log('error inserting...', error));
});

router.post('/login', (request, response) => {

    const { errors, isValid } = validateLoginInput(request.body);

    if (!isValid) {
        return response.status(400).json(errors);
    }
    
    const email = request.body.email;
    const password = request.body.password;



    //find user by email
    User.findOne({ email })
        .then(user => {
            //check for user
            if (!user) {
                errors.email = 'email not found';
                return response.status(400).json(errors);
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // response.json({message: 'success'});
                        // user found
                        // sign token
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }
                        jwt.sign(payload, keys.secret, { expiresIn: 3600 },
                            (error, token) => {
                                response.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });

                            });
                    }
                    else {
                        errors.password = 'password incorrect';
                        return response.status(400).json(errors);
                    }
                });
        })
});

router.get('/current', passport.authenticate('jwt', { session: false }), (request, response) => {
    response.json({ id: request.user.id, name: request.user.name, email: request.user.email });
});

module.exports = router;