/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getProfile: function (req, res, next){
		sails.log.info(req.query.id, req.session.profile.id, req.query.id == req.session.profile.id);
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
			sails.log.debug('profile', profile);
			return res.json(profile);
		});
	}

};
