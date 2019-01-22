const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validation
const validateProfileInput = require('../../validation/profile')

//Load profile
const Profile = require('../../models/Profile');
//Load user
const User = require('../../models/User');

router.get('/test', (request, response) => response.json({ message: 'profile success' }));

router.get('/user/:user_id', passport.authenticate('jwt', { session: false }), (request, response) => {
    const errors = {}

    Profile.findOne({user: request.params.user_id})
          .populate('user', ['name', 'avatar'])
          .then(profile => {
              if(!profile){
                  errors.noprofile = 'There is no profile for this user';
                  return response.status(404).json(errors);
              }
              response.json(profile);
          })
        .catch(error => response.status(404).json(errors));
});

router.get('/handle/:handle', passport.authenticate('jwt', { session: false }), (request, response) => {
    const errors = {}

    Profile.findOne({handle: request.params.handle})
          .populate('user', ['name', 'avatar'])
          .then(profile => {
              if(!profile){
                  errors.noprofile = 'There is no profile for this user';
                  return response.status(404).json(errors);
              }
              response.json(profile);
          })
        .catch(error => response.status(404).json(errors));
});

router.get('/', passport.authenticate('jwt', { session: false }), (request, response) => {
    const errors = {};
    Profile.findOne({ user: request.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                return response.status(404).json(errors);
            }
            response.json(profile);
        })
        .catch(error => response.status(404).json(errors));
});

router.post('/', passport.authenticate('jwt', { session: false }), (request, response) => {
    const { errors, isValid } = validateProfileInput(request.body);
    if(!isValid) {
        return response.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = request.user.id;
    if (request.body.handle) {
        profileFields.handle = request.body.handle;
    }
    if (request.body.company) {
        profileFields.company = request.body.company;
    }
    if (request.body.website) {
        profileFields.website = request.body.website;
    }
    if (request.body.location) {
        profileFields.location = request.body.location;
    }
    if (request.body.bio) {
        profileFields.bio = request.body.bio;
    }
    if (request.body.status) {
        profileFields.status = request.body.status;
    }
    if (request.body.githubusername) {
        profileFields.githubusername = request.body.githubusername;
    }

    if (typeof request.body.skills !== 'undefined') {
        profileFields.skills = request.body.skills.split(',');
        profileFields.handle = request.body.handle;
    }

    profileFields.social = {};
    if (request.body.youtube) {
        profileFields.social.youtube = request.body.youtube;
    }
    if (request.body.twitter) {
        profileFields.social.twitter = request.body.twitter;
    }
    if (request.body.facebook) {
        profileFields.social.facebook = request.body.facebook;
    }
    if (request.body.linkedin) {
        profileFields.social.linkedin = request.body.linkedin;
    }
    if (request.body.instagram) {
        profileFields.social.instagram = request.body.instagram;
    }

    Profile.findOne({ user: request.user.id })
        .then(profile => {
            if (profile) {
                Profile.findOneAndUpdate(
                    { user: request.user.id },
                    { $set: profileFields },
                    { new: true })
                    .then(profile => {
                        return response.json(profile)
                    });
            }
            else {
                Profile.findOne({handle: profileFields.handle})
                      .then(profile => {
                          if(profile){
                              errors.handle = 'That handle already exists';
                              return response.status(400).json(errors);
                          }
                          new Profile(profileFields)
                              .save()
                              .then(profile => response.json(profile));
                      });
            }
        });
});
module.exports = router;