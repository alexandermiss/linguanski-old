'use strict';
/* jshint unused:false */

/**
 * hasJsonWebToken
 *
 * @module      :: Policy
 * @description :: Assumes that your request has an jwt;
 *
 * @docs        :: http://waterlock.ninja/documentation
 */
module.exports = function(req, res, next) {
  waterlock.validator.validateTokenRequest(req, function(err, user){

    if(err){
      return res.unauthorized(err);
    }

    Profile.getFullProfile({user: user.id}).then(function(profile){
      sails.log.debug('PROFILE getFullProfile', profile);
      req.session['profile'] = profile;
      // req.session['image'] = profile.image;
      req.session['setting'] = profile.setting;
      user['image'] = profile.user.image;
      return next();
    })
    .catch(function(err){
      return res.json(new Error('Profile not found'));
    });

  });
};
