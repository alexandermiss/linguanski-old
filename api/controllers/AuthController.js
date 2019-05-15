/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

// var _ = require('lodash');
var bcrypt = require('bcrypt');

module.exports = {
    _config:{
      actions: true,
      rest: true,
      shortcuts: true
    },

    // Custom login with waterlock
    login: async function (req, res){
      var params = req.allParams();
      console.log('params', params);

      const email = req.param('email');
      const pass = req.param('password');

      if(!email || !pass){
        return res.json(401, {message: 'Email and password incorrect.'});
      }

      const user = await User.findOne({email: email});

      if(!user) {
        return res.json(401, {message: 'User does not exists'});
      }

      const comp = bcrypt.compareSync(pass, user.password);

      if (!comp){
        return res.json(401, {message: 'Password incorrect'});
      }
      
      const token = await sails.helpers.createToken(user.id);

      if(!token) { return res.json(401, {message: 'Token error'})};

      // return res.json({token: token.token});

      if(user){
        if(bcrypt.compareSync(params.password, user.password)){
          
          try{
            var setting = await Setting.findOne({user: user.id});
            if( _.isArray(setting) ) setting = setting[0];

            var profile = await Profile.getFullProfile({user: user.id});
            req.session.authenticated = true;
            req.session.user = user;
            req.session['profile'] = profile.profile;
            req.session['setting'] = setting;
  
            user['image'] = profile.image;
            user['setting'] = setting;
            return res.json({ access_token: token.token, user: user });
          }
          catch(ex){
            console.log(ex);
            return res.status(500).send("Sorry!");
          }

          }
        }
              
  	},

    register: async function (req, res){
      var params = req.allParams();
      
      const email = req.param('email');
      const pass = req.param('password');

      if (!email || !pass) return res.status(400).json({message: 'Bad request'});

      var user_exists = await User.findOne({email: email});

      if(user_exists) {
        return res.status(401).json({message: 'Email exists'});
      }

      const hash = await sails.helpers.generatePassword(pass);

      var user = await User.create({
        email: email, name: params.name, password: hash
      }).fetch();

      const token = await sails.helpers.createToken(user.id);

      if(user){
        var p = _.extend({}, {id: user.id}, params);
        var user_setting = await User.generateSetting(p);
        if( _.isArray(user_setting) ) user_setting = user_setting[0];

        console.log('user_settinguser_setting', user_setting);

        var profile = await Profile.getFullProfile({user: user.id});
        req.session.authenticated = true;
        req.session.user = user_setting.user;
        req.session['profile'] = profile.profile;
        req.session['setting'] = user_setting.setting;

        user['image'] = profile.image;
        user['setting'] = user_setting.setting;
        return res.json({ access_token: token.token, user: user });

      }else{
        return res.status(500).send("User not found!");
      }

  	},


    logout: function (req, res){
  		if( req.session['setting'] ) delete req.session['setting'];
  		if( req.session['user'] ) delete req.session['user'];
  		if( req.session['image'] ) delete req.session['image'];
      if( req.session['profile'] ) delete req.session['profile'];
      
      req.session.authenticated = false;

  		return res.json({login: false});
  	}

};
