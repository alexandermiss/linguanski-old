/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var cloudinary = require('cloudinary').v2;
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

	getFullProfile: function (req, res, next){
		var id = _.get(_.extend(req.params.all(), req.query), 'id');
		Profile.getFullProfile({id: id},function(err, profile){
			if(err) return res.json(err);
			return res.json(profile);
		});

	},

	updatePhoto: function (req, res, next){
		cloudinary.config({
		  cloud_name: 'dugrtplgz',
		  api_key: '882717145424918',
		  api_secret: '-WwDb-q4CDx4ZhPSm_oIssibKb0'
		});

		req.file('file').upload({
			dirname: sails.config.rootPath + '/assets/images'
		},function(err, uploaded){
			if(err){
				sails.log.debug(err);
				return res.json(err);
			}
			var file = uploaded[0].fd;
			var _result = null;

			cloudinary.uploader.upload(file)
				.then(function(result){
					_result = result;
					return _result;
				}).then(function(data){
					sails.log.info('data', data);
				}).finally(function(){
					User.update({id: req.session.user.id}, {photo: _result.secure_url})
						.exec(function(err, user){
							if(err) return res.json({err: err});
							return res.json(_result);
						});
				});
		});

	}

};
