/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	listPost: function ( req, res, next ){

		Post.listPost().then(function(posts){
			return res.json({results: posts});
		})
		.catch(function(err){
			sails.log.debug('listPost ERR\n', err);
			return res.json(err);
		});

	},

	addPost: function ( req, res, next ){
		var p = req.params.all();
		var s = req.session.setting;

		sails.log.debug('P\n', p);
		sails.log.debug('S\n', s);

		var obj = {
			user: req.session.user,
			image: req.session.image,
			post_type: 'p',
			post_text: p.post_text || '',
			phrase_native: p.phrase_native,
			native: s.country.language,
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
