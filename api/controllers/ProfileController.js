/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {
	getProfile: function (req, res, next){
		var __i = req.query.id;
		Profile.findOne(__i).exec(function(err, profile){
			if(err) return res.negotiate(err);
			var __s = (req.query.id === req.session.profile.id) ? true : false;
			return res.view('profile/main', {__s: __s, __i: __i});
		});

	},

	getBasicData: function (req, res, next){
		var id = req.param('id');
		sails.log.info(id);
		Profile.findOne(id).populateAll().exec(function(err, profile){
			if(err) return res.json(err);
			Setting.findOne({user: profile.user.id}).populateAll().exec(function(err, setting){
				if(err) return res.json(err);
				Language.findOne(setting.country.language).exec(function(err, lang){
					if(err) return res.json(err);
					profile['setting'] = setting;
					profile.setting.country.language = lang;
					return res.json(profile);
				});
			});
		});
	}

};
