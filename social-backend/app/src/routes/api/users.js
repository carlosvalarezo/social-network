const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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

module.exports = router;