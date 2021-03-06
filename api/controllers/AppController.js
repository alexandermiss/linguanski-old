/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	loginform: function ( req, res, next){
		return res.view('auth/signin', {layout:'layouts/login_layout', title: 'Sign In'});
	},

	registerform: async function ( req, res, next){

		var langs = await Language.find({});

		return res.view('auth/signup', {
			layout:'layouts/login_layout', title: 'Sign Up',
			langs: langs
		});
	
	},

	authorizations: function (req, res, next){
		return res.view('auth/authorizations_view');
	},

	traductions: function (req, res, next){
		Traduction.find({}).populate('phrase').exec(function (err, trads ){
			if (err) { return res.negotiate(err); }
			return res.view('traductions/init', { trads: trads });
		});
	},

	phrases: function (req, res, next){
		Language.find({}).exec(function (err, langs ){
			if (err) { return res.negotiate(err); }
			return res.view('phrases/init', { langs: langs, menu: 'phrases' });
		});
	},

	practice: function (req, res, next){
		return res.view('practice/index', {menu: 'practica'});
	},

	info: function (req, res, next){
		return res.json(req.session || {});
	},

	feed: function (req, res, next){
		return res.view('post/post_index', {menu: 'feed', secondary: 'feed'});
	},

	getAuthDatas: function (req, res){
		return res.json(req.session);
	}

};
