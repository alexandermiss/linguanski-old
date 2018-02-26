/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

var _ = require('lodash');
var bcrypt = require('bcrypt');

module.exports = require('waterlock').waterlocked({
    _config:{
      actions: true,
      rest: true,
      shortcuts: true
    },

    // Custom login with waterlock
    login: function (req, res){
      var params = req.allParams();
      console.log('params', params);
  		waterlock.engine.findAuth({email: params.email}, function (err, user){
          if(err) {
            if(err.code === 'E_VALIDATION'){
              return res.status(400).json(err);
            }else{
              return res.serverError(err);
            }
          }

          if(user){
            if(bcrypt.compareSync(params.password, user.auth.password)){
              try {
                Profile.getFullProfile({user: user.id}).then(function(profile){
                  // console.log('Profile', profile);
                  req.session['profile'] = profile;
                  req.session['setting'] = profile.setting;
                  user['image'] = profile.user.image;
                  return waterlock.cycle.loginSuccess(req, res, user);
                }).catch(function(e){
                  // console.log('ePromise', e);
                  return waterlock.cycle.loginFailure(req, res, null, {error: 'Profile not found'});
                });
              } catch (e) {
                // console.log('e', e);
                return waterlock.cycle.loginFailure(req, res, null, {error: 'Profile not found'});
              }

            }else{
              waterlock.cycle.loginFailure(req, res, null, {error: 'Invalid email or password'});
            }
          }else{
            waterlock.cycle.loginFailure(req, res, null, {error: 'User not found'});
          }
        });
  	},

    register: function (req, res){
      var params = req.allParams();

      waterlock.engine.findAuth({email: params.email}, function(err, user) {
        if (user) {
          waterlock.cycle.registerFailure(req, res, null, {
            error: scope.type + ' is already in use'
          });
        }

        waterlock.engine.findOrCreateAuth({email: params.email}, params, function(err, user){
          if(err) {
            if(err.code === 'E_VALIDATION'){
              return res.status(400).json(err);
            }else{
              return res.serverError(err);
            }
          }
          sails.log.debug('user', user);
          if(user){
            var p = _.extend({}, {id: user.id}, params);
            User.generateSetting(p, function(err, _user){
              if( _.isArray(_user) ) _user = _user[0];

              Profile.getFullProfile({user: user.id}).then(function(profile){
                req.session['profile'] = profile;
                req.session['setting'] = profile.setting;
                user['image'] = profile.user.image;
                return waterlock.cycle.loginSuccess(req, res, user);
              })
              .catch(function(err){
                return waterlock.cycle.loginFailure(req, res, null, {error: 'Profile not found'});
              });

            });
          }else{
            return waterlock.cycle.loginFailure(req, res, null, {error: 'User not found'});
          }

        }); // findOrCreateAuth

      }); // findAuth
  	},


    logout: function (req, res){
  		if( req.session['setting'] ) delete req.session['setting'];
  		if( req.session['user'] ) delete req.session['user'];
  		if( req.session['image'] ) delete req.session['image'];
  		if( req.session['profile'] ) delete req.session['profile'];

  		return waterlock.cycle.logout(req, res);
  	}

});
