const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');

router.get('/test', (request, response) => response.json({message: 'posts success'}));

router.post('/', passport.authenticate('jwt', {session: false}), (request, response) => {
    const { errors, isValid } = validatePostInput(request.body);

    if(!isValid){
        return response.status(400).json(errors);
    }

    const newPost = new Post({
        text: request.body.text,
        name: request.body.name,
        avatar: request.body.avatar
    });
    newPost.save()
           .then(post => response.json(post));
});

module.exports = router;