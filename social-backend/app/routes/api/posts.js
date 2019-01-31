const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

router.get('/test', (request, response) => response.json({message: 'posts success'}));

router.get('/', passport.authenticate('jwt', {session:false}), (request, response) => {
    Post.find()
        .sort({date: -1})
        .then(posts => response.json(posts))
        .catch(error => response.status(404).json({message: 'no posts found' }));
});

router.get('/:post_id', passport.authenticate('jwt', {session:false}), (request, response) => {
    Post.findById(request.params.post_id)
        .sort({date: -1})
        .then(posts => response.json(posts))
        .catch(error => response.status(404).json({message: 'no post found' }));
});

router.post('/', passport.authenticate('jwt', {session: false}), (request, response) => {
    const { errors, isValid } = validatePostInput(request.body);

    if(!isValid){
        return response.status(400).json(errors);
    }

    const newPost = new Post({
        text: request.body.text,
        name: request.body.name,
        avatar: request.body.avatar,
        user: request.user.id
    });
    newPost.save()
           .then(post => response.json(post));
});

router.post('/', passport.authenticate('jwt', {session: false}), (request, response) => {
    const { errors, isValid } = validatePostInput(request.body);

    if(!isValid){
        return response.status(400).json(errors);
    }

    const newPost = new Post({
        text: request.body.text,
        name: request.body.name,
        avatar: request.body.avatar,
        user: request.user.id
    });
    newPost.save()
           .then(post => response.json(post));
});

router.delete('/:post_id', passport.authenticate('jwt', {session: false}), (request, response) => {
    Profile.findOne({user: request.user.id})
          .then(profile => {
                Post.findById(request.params.post_id)
                    .then(post => {
                        if(post.user.toString() !== request.user.id){
                            response.status(401).json({message: 'user not authorised'});
                        }
                        post.remove()
                            .then(() => response.json({success: true}));
                    })
                    .catch(error => response.status(404).json({message: 'post not found'}));
          });
});

router.post('/like/:post_id', passport.authenticate('jwt', {session: false}), (request, response) => {

    Profile.findOne({user: request.user.id})
          .then(profile => {
                Post.findById(request.params.post_id)
                    .then(post => {
                        if(post.likes.filter(like => like.user.toString() === request.user.id).length > 0){
                            return response.status(400).json({message: 'user already liked this post'});
                        }
                        post.likes.unshift({user: request.user.id});

                        post.save().then(post => response.json(post));
                    })
                    .catch(error => response.status(404).json({message: 'post not found'}));
          });
});

router.post('/unlike/:post_id', passport.authenticate('jwt', {session: false}), (request, response) => {

    Profile.findOne({user: request.user.id})
          .then(profile => {
                Post.findById(request.params.post_id)
                    .then(post => {
                        if(post.likes.filter(like => like.user.toString() === request.user.id).length === 0){
                            return response.status(400).json({message: 'you have not liked yet this post'});
                        }
                        const removeIndex = post.likes.map(like => like.user.toString())
                                                      .indexOf(request.user.id);

                        post.likes.splice(removeIndex, 1);

                        post.save()
                            .then(post => {
                                response.json(post);
                            });
                    })
                    .catch(error => response.status(404).json({message: 'post not found'}));
          });
});


router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (request, response) => {

    const { errors, isValid } = validatePostInput(request.body);

    if(!isValid){
        return response.status(400).json(errors);
    }

    Post.findById(request.params.post_id)
        .then(post => {
            const newComment = {
                text: request.body.text,
                name: request.body.name,
                avatar: request.body.avatar,
                user: request.user.id
            }

            post.comments.unshift(newComment);

            post.save().then(post => response.json(post));
        })
        .catch(error => response.status(404).json({message: 'post not found'}));
});


router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session: false}), (request, response) => {
    Post.findById(request.params.post_id)
        .then(post => {
            if(post.comments.filter(comment => comment._id.toString() === request.params.comment_id).length === 0){
                return response.status(404).json({message: 'comment not exist'});
            }

            const removeIndex = post.comments.map(item => item._id.toString())
                                             .indexOf(request.params.comment_id);

            post.comments.splice(removeIndex, 1);

            post.save()
                .then(post => response.json({message: 'comment deleted from post'}));
            
        })
        .catch(error => response.status(404).json({message: 'post not found'}));
});

module.exports = router;