/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {model: 'user'},
    info: { type: 'string', defaultsTo: 'No info'}
  },

  getFullProfile: function (opts, cb){

    Profile.findOne(opts).populateAll().exec(function(err, profile){
			if(err) return cb(err);
			Setting.findOne({user: profile.user.id}).populateAll().exec(function(err, setting){
				if(err) return cb(err);
				Language.findOne(setting.country.language).exec(function(err, lang){
					if(err) return cb(err);
					profile['setting'] = setting;
					profile.setting.country.language = lang;
					return cb(null, profile);
				});
			});
		});

  }
};
