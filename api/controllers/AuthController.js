/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

var bcrypt = require('bcrypt');

module.exports = require('waterlock').waterlocked({
    _config:{
      actions: true,
      rest: true,
      shortcuts: true
    },

    // Custom login with waterlock
    login: function (req, res){
      var params = req.params.all();

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
  						Profile.getFullProfile({user: user.id}).then(function(profile){
  							user['image'] = profile.image;
  							user['setting'] = profile.setting;
  							return waterlock.cycle.loginSuccess(req, res, user);
  						})
  						.catch(function(err){
  							return waterlock.cycle.loginFailure(req, res, null, {error: 'Profile not found'});
  						});

            }else{
              waterlock.cycle.loginFailure(req, res, user, {error: 'Invalid email or password'});
            }
          }else{
            waterlock.cycle.loginFailure(req, res, null, {error: 'User not found'});
          }
        });
  	},
});
