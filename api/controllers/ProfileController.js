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
		var __i = req.param('id');
		Profile.findOne(__i).exec(function(err, profile){
			if(err) return res.negotiate(err);
			var __s = (req.param('id') === req.session.profile.id) ? true : false;
			return res.view('profile/main', {__s: __s, __i: __i, menu: 'profile'});
		});

	},

	getFullProfile: function (req, res, next){
		var id = _.get(_.extend(req.params.all(), req.query), 'id');

		Profile.getFullProfile({id: id}).then(function(profile){
			return res.json(profile);
		})
		.catch(function(e){
			return res.notFound(e);
		});

	},

	updatePhoto: function (req, res, next){
		cloudinary.config({
		  cloud_name: 'linguanski',
		  api_key: '882717145424918',
		  api_secret: '-WwDb-q4CDx4ZhPSm_oIssibKb0'
		});

		var uploader = Promise.promisifyAll(req.file('file'));

		Promise.bind({}, uploader.uploadAsync({dirname: sails.config.rootPath + '/assets/images'}))
		.then(function(uploaded){
			this.uploaded = uploaded[0].fd;
			return cloudinary.uploader.upload(this.uploaded);
		})
		.then(function (r){
			fs.unlinkSync(this.uploaded);

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
			sails.log.debug('r', r);
			return Fichero.create(c);
		})
		.then(function(file){
			this.file = file;
			return Profile.getFullProfile({user: req.session.user.id});
		})
		.then(function(profile){
			req.session.user = profile.user;
			req.session['profile'] = profile;
      req.session['image'] = profile.image;
      req.session['setting'] = profile.setting;

			return res.json(this.result);
		})
		.catch(function(e){
			sails.log.error(e);
			return res.json(e);
		});

	}

};
