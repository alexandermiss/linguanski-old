/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs 					= require('fs'),
		cloudinary 	= require('cloudinary').v2,
		_ 					= require('lodash'),
		Promise 		= require('bluebird');


module.exports = {
	getProfile: function (req, res, next){
		try{
			var __i = req.param('id');
			Profile.findOne(__i).exec(function(err, profile){
				if(err) return res.negotiate(err);
				if(!profile) return res.notFound('Profile not found');

				var __s = (req.param('id') === req.session.profile.id) ? true : false;
				return res.view('profile/main', {__s: __s, __i: __i, menu: 'profile'});

			});
		}catch(err){
			return res.notFound('Profile not found!');
		}

	},

	getFullProfile: function (req, res, next){
		var id = _.get(_.extend(req.allParams(), req.query), 'id');

		Profile.getFullProfile({id: id}).then(function(profile){
			return res.json(profile);
		})
		.catch(function(e){
			return res.notFound(e);
		});

	},

	updatePhoto: function (req, res, next){
		var file = req.files.file;

		cloudinary.config({
		  cloud_name: 'linguanski',
		  api_key: '882717145424918',
		  api_secret: '-WwDb-q4CDx4ZhPSm_oIssibKb0'
		});

		cloudinary.uploader.upload(file.path).then(function(r){
			this.result = r;
			var domain = 'https://res.cloudinary.com/linguanski/image/upload/';
	    var custom = domain + 'c_thumb,w_80/v';
	    r.photo80x80 = custom+r.version+'/'+r.public_id+'.'+r.format;

			var c = {};
			_.extend(c, {user: req.session.user.id}, {photo80x80: r.photo80x80},
				_.pick(r,
					'public_id', 'url', 'secure_url', 'original_filename',
					'resource_type', 'signature', 'type', 'format', 'bytes', 'version',
					'width', 'height'
				));
			return Fichero.create(c); // Saves the image
		})
		.then(function(file){
			this.file = file;
			sails.log.verbose('__file', file);
			return User.update({id: req.session.user.id}, {image: file});
		})
		.then(function(user){
			var profile = req.session.profile;
			req.session.user['image'] = this.file;
			req.session['image'] = this.file;
			return res.json(this.result);
		})
		.catch(function(e){
			sails.log.error(e);
			return res.json(e);
		});
	}

};
