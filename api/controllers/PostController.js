/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// var _ = require('lodash');

module.exports = {

	listPost: function ( req, res, next ){
		var p = _.pick(req.allParams(), 'page', 'limit');
		if(!_.has(p, 'page')) p.page = 1;
		if(!_.has(p, 'limit')) p.limit = 10;

		p = _.pick(p, 'page', 'limit');

		Post.listPost(p, function(err, posts){
			if(err){
				sails.log.debug('listPost ERR\n', err);
				return res.json(err);
			}
			if( posts.length )
				return res.json({ from: true, data: 'da', page: p.page, limit: p.limit, results: posts});
			return res.json({ from: true, data: 'niet', page: p.page, limit: p.limit, results: posts});
		});

	},

	addPost: function ( req, res, next ){
		var p = req.allParams();
		var s = req.session.setting;

		sails.log.debug('P\n', p);
		sails.log.debug('S\n', s);

		var obj = {
			user: req.session.user,
			profile: req.session.profile,
			image: req.session.user.image,
			post_type: p.post_type,
			post_text: p.post_text || '',
			phrase_native: p.phrase_native || null,
			native: s.country.language || null,
			learning: s.language,
			country_language_id: s.country.language.id,
			phrase_language: p.phrase_language,
			language_id: s.language.id,
			phrase_id: p.phrase_id
		};

		Post.addPost(obj).then(function(post){
			sails.log.debug('Post.addPost\n', post);
			return res.json(post);
		})
		.catch(function(err){
			return res.json(err);
		});

	}

};
