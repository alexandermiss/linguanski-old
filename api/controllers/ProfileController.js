/**
 * ProfileController
 *
 * @description :: Server-side logic for managing profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var cloudinary = require('cloudinary');
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

		// cloudinary.config({
		//   cloud_name: 'dugrtplgz',
		//   api_key: '882717145424918',
		//   api_secret: '-WwDb-q4CDx4ZhPSm_oIssibKb0'
		// });

		// {
		// 	public_id: 'sample_id',
		// 	crop: 'limit',
		// 	width: 2000,
		// 	height: 2000,
		// 	eager: [
		// 		{ width: 200, height: 200, crop: 'thumb', gravity: 'face',
		// 			radius: 20, effect: 'sepia' },
		// 		{ width: 100, height: 150, crop: 'fit', format: 'png' }
		// 	],
		// 	tags: ['special', 'for_homepage']
		// }

		if(req.isSocket){
			sails.log.info('socket');
		}else{
			sails.log.info('NO socket');
		}

		sails.log.debug('loading file');
		// return res.json({});

		req.file('file').upload({
			dirname: sails.config.rootPath + '/assets/images'
		},function(err, uploaded){
			if(err){
				sails.log.debug(err);
				return res.json({});
			}
			sails.log.info(uploaded);
			return res.json({});
		});

		// cloudinary.uploader.upload(
		//   req.files.,
		//   function(result) {
		// 		console.log(result);
		//
		// 	}
		//
		// );

	}

};
